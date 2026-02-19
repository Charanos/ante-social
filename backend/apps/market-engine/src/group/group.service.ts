import { Injectable, Logger, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument, GroupBet, GroupBetDocument, User, UserDocument } from '@app/database';
import { ClientProxy, ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { KAFKA_TOPICS, PLATFORM_FEE_RATE } from '@app/common';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(GroupBet.name) private groupBetModel: Model<GroupBetDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject('WALLET_SERVICE') private walletClient: ClientProxy,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  // ─── Group Management ─────────────────────────────
  async createGroup(data: { name: string; description?: string; isPublic?: boolean }, userId: string) {
    const group = new this.groupModel({
      ...data,
      createdBy: userId,
      members: [{ userId, role: 'admin', joinedAt: new Date() }],
      memberCount: 1,
    });
    await group.save();
    
    // Update user group count
    await this.userModel.findByIdAndUpdate(userId, { $inc: { groupMemberships: 1 } });
    
    this.logger.log(`Group created: ${group.name} by ${userId}`);
    return group;
  }

  async searchGroups(search?: string, limit = 20, offset = 0) {
    const filter: any = { isPublic: true };
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    const groups = await this.groupModel.find(filter)
      .skip(offset)
      .limit(limit)
      .sort({ memberCount: -1 })
      .exec();
      
    return groups;
  }

  async getGroup(id: string) {
    const group = await this.groupModel.findById(id).populate('members.userId', 'username avatarUrl');
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async joinGroup(groupId: string, userId: string) {
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    const isMember = group.members.some(m => m.userId.toString() === userId);
    if (isMember) throw new BadRequestException('Already a member');

    group.members.push({ userId: new Types.ObjectId(userId) as any, role: 'member', joinedAt: new Date() });
    group.memberCount += 1;
    await group.save();

    await this.userModel.findByIdAndUpdate(userId, { $inc: { groupMemberships: 1 } });
    return group;
  }

  async leaveGroup(groupId: string, userId: string) {
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    group.members = group.members.filter(m => m.userId.toString() !== userId);
    group.memberCount = Math.max(0, group.memberCount - 1);
    await group.save();

    await this.userModel.findByIdAndUpdate(userId, { $inc: { groupMemberships: -1 } });
    return group;
  }

  // ─── Group Bets ───────────────────────────────────
  async createGroupBet(groupId: string, data: any, userId: string) {
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    // Create bet
    const bet = new this.groupBetModel({
      groupId,
      createdBy: userId,
      title: data.title,
      description: data.description,
      marketType: data.marketType, // 'winner_takes_all' or 'odd_one_out'
      buyInAmount: data.buyInAmount,
      options: data.options || [],
      participants: [], 
      status: 'active',
    });

    // Creator auto-joins
    await this.joinBetInternal(bet, userId, data.selectedOption);
    
    // Debit creator wallet
    await this.debitWallet(userId, data.buyInAmount, `Group Bet: ${data.title}`);

    group.activeBetsCount += 1;
    group.totalBets += 1;
    await group.save();

    return bet;
  }

  async getGroupBets(groupId: string) {
    return this.groupBetModel.find({ groupId }).sort({ createdAt: -1 }).populate('participants.userId', 'username avatarUrl');
  }

  async joinBet(betId: string, selectedOption: string, userId: string) {
    const bet = await this.groupBetModel.findById(betId);
    if (!bet) throw new NotFoundException('Bet not found');
    if (bet.status !== 'active') throw new BadRequestException('Bet is not active');

    const amount = bet.buyInAmount;
    
    // Debit wallet first
    await this.debitWallet(userId, amount, `Join Group Bet: ${bet.title}`);

    // Add to participants
    await this.joinBetInternal(bet, userId, selectedOption);
    
    return bet;
  }

  // ─── Settlement Logic ─────────────────────────────
  async declareWinner(betId: string, winnerId: string, userId: string) {
    const bet = await this.groupBetModel.findById(betId);
    if (!bet) throw new NotFoundException('Bet not found');
    if (bet.createdBy.toString() !== userId) throw new BadRequestException('Only creator can declare winner');
    if (bet.status !== 'active') throw new BadRequestException('Bet not active');

    bet.status = 'pending_confirmation';
    bet.declaredWinnerId = new Types.ObjectId(winnerId);
    bet.confirmationDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h to dispute
    await bet.save();

    return bet;
  }

  async confirmResult(betId: string, userId: string) {
    // In a real app, we'd track who confirmed to avoid duplicates.
    // For MVP, simplistic counter.
    const bet = await this.groupBetModel.findOneAndUpdate(
      { _id: betId, status: 'pending_confirmation' },
      { $inc: { confirmations: 1 }, $set: { ['participants.$[elem].hasConfirmed']: true } },
      { arrayFilters: [{ 'elem.userId': userId }], new: true }
    );
    
    if (!bet) throw new NotFoundException('Bet not found or not in pending state');

    // If enough confirmations (e.g. > 50% of participants), settle
    if (bet.confirmations >= bet.participants.length / 2) {
      await this.settleGroupBet(bet);
    }

    return bet;
  }

  async disagreeResult(betId: string, userId: string) {
    const bet = await this.groupBetModel.findOneAndUpdate(
      { _id: betId, status: 'pending_confirmation' },
      { $inc: { disagreements: 1 }, $set: { ['participants.$[elem].hasDisagreed']: true } },
      { arrayFilters: [{ 'elem.userId': userId }], new: true }
    );

    if (!bet) throw new NotFoundException('Bet not found');

    // If dispute threshold reached (e.g. > 30%), mark as disputed
    if (bet.disagreements >= bet.participants.length * 0.3) {
      bet.status = 'disputed';
      await bet.save();
      // Notify admins via Kafka?
    }

    return bet;
  }

  // ─── Internal Helpers ─────────────────────────────
  private async joinBetInternal(bet: GroupBetDocument, userId: string, selectedOption?: string) {
    bet.participants.push({
      userId: new Types.ObjectId(userId) as any,
      selectedOption,
      hasConfirmed: false,
      hasDisagreed: false,
      isWinner: false,
      payoutAmount: 0,
      joinedAt: new Date(),
    });
    bet.totalPool += bet.buyInAmount;
    bet.prizePoolAfterFees = bet.totalPool * (1 - PLATFORM_FEE_RATE);
    bet.platformFeeCollected = bet.totalPool * PLATFORM_FEE_RATE;
    await bet.save();
  }

  private async debitWallet(userId: string, amount: number, description: string) {
    try {
      await lastValueFrom(
        this.walletClient.send('debit_balance', {
          userId,
          amount,
          currency: 'USD',
          description,
          type: 'bet_placed',
        })
      );
    } catch (e: any) {
      this.logger.error(`Wallet debit failed for ${userId}: ${e.message}`);
      throw new BadRequestException('Insufficient funds or wallet error');
    }
  }

  private async settleGroupBet(bet: GroupBetDocument) {
    bet.status = 'settled';
    
    if (bet.marketType === 'winner_takes_all' && bet.declaredWinnerId) {
      const winnerId = bet.declaredWinnerId.toString();
      const prize = bet.prizePoolAfterFees || 0;

      // Update winner status
      const participant = bet.participants.find(p => p.userId.toString() === winnerId);
      if (participant) {
        participant.isWinner = true;
        participant.payoutAmount = prize;
        
        // Credit wallet
        await lastValueFrom(
          this.walletClient.send('credit_balance', {
            userId: winnerId,
            amount: prize,
            currency: 'USD',
            description: `Group Bet Win: ${bet.title}`,
            type: 'bet_payout',
          })
        );
      }
    }
    // TODO: Handle 'odd_one_out' settlement logic if needed
    
    bet.payoutProcessed = true;
    await bet.save();
  }
}
