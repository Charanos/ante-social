import { Controller, Get, Post, Body, Param, UseGuards, Query, Patch } from '@nestjs/common';
import { GroupService } from './group.service';
import { JwtAuthGuard, CurrentUser } from '@app/common';
import { UserDocument } from '@app/database';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  // ─── Group Management ─────────────────────────────
  @Post()
  async createGroup(
    @Body() data: { name: string; description?: string; isPublic?: boolean },
    @CurrentUser() user: UserDocument,
  ) {
    return this.groupService.createGroup(data, user._id.toString());
  }

  @Get()
  async getGroups(
    @Query('search') search?: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    return this.groupService.searchGroups(search, Number(limit), Number(offset));
  }

  @Get(':id')
  async getGroup(@Param('id') id: string) {
    return this.groupService.getGroup(id);
  }

  @Post(':id/join')
  async joinGroup(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.groupService.joinGroup(id, user._id.toString());
  }

  @Post(':id/leave')
  async leaveGroup(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.groupService.leaveGroup(id, user._id.toString());
  }

  // ─── Group Bets ───────────────────────────────────
  @Post(':id/bets')
  async createBet(
    @Param('id') groupId: string,
    @Body() data: any,
    @CurrentUser() user: UserDocument,
  ) {
    return this.groupService.createGroupBet(groupId, data, user._id.toString());
  }

  @Get(':id/bets')
  async getGroupBets(@Param('id') groupId: string) {
    return this.groupService.getGroupBets(groupId);
  }

  @Post('bets/:betId/join')
  async joinBet(
    @Param('betId') betId: string,
    @Body('selectedOption') selectedOption: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.groupService.joinBet(betId, selectedOption, user._id.toString());
  }

  @Post('bets/:betId/declare')
  async declareWinner(
    @Param('betId') betId: string,
    @Body('winnerId') winnerId: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.groupService.declareWinner(betId, winnerId, user._id.toString());
  }

  @Post('bets/:betId/confirm')
  async confirmResult(@Param('betId') betId: string, @CurrentUser() user: UserDocument) {
    return this.groupService.confirmResult(betId, user._id.toString());
  }

  @Post('bets/:betId/disagree')
  async disagreeResult(@Param('betId') betId: string, @CurrentUser() user: UserDocument) {
    return this.groupService.disagreeResult(betId, user._id.toString());
  }
}
