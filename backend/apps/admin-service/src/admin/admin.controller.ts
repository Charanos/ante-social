import { Controller, Get, Post, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { JwtAuthGuard, RolesGuard, Roles, UserRole, CurrentUser } from '@app/common';
import { UserDocument } from '@app/database';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  // ─── Dashboard & Users ─────────────────────────────
  @Get('dashboard')
  async getDashboard() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('users')
  async getUsers(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('tier') tier?: string,
  ) {
    return this.adminService.getUsers(limit, offset, search, role, tier);
  }

  @Post('users/:id/ban')
  async banUser(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.adminService.banUser(id, reason);
  }

  @Post('users/:id/unban')
  async unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id);
  }

  @Patch('users/:userId/tier')
  async updateTier(
    @Param('userId') userId: string,
    @Body('tier') tier: string,
  ) {
    return this.adminService.updateUserTier(userId, tier);
  }

  // ─── Compliance ────────────────────────────────────
  @Get('compliance/flags')
  async getComplianceFlags(
    @Query('status') status?: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    return this.adminService.getComplianceFlags(status, Number(limit), Number(offset));
  }

  @Post('compliance/freeze')
  async freezeAccount(
    @Body('userId') userId: string,
    @Body('reason') reason: string,
    @CurrentUser() admin: UserDocument,
  ) {
    return this.adminService.freezeAccount(userId, reason, admin._id.toString());
  }

  @Post('compliance/unfreeze')
  async unfreezeAccount(
    @Body('userId') userId: string,
    @CurrentUser() admin: UserDocument,
  ) {
    return this.adminService.unfreezeAccount(userId, admin._id.toString());
  }

  // ─── Withdrawal Approval ──────────────────────────
  @Get('withdrawals')
  async getPendingWithdrawals(@Query('limit') limit = 20, @Query('offset') offset = 0) {
    return this.adminService.getPendingWithdrawals(Number(limit), Number(offset));
  }

  @Post('withdrawals/:id/approve')
  async approveWithdrawal(
    @Param('id') id: string,
    @CurrentUser() admin: UserDocument,
  ) {
    return this.adminService.approveWithdrawal(id, admin._id.toString());
  }

  @Post('withdrawals/:id/reject')
  async rejectWithdrawal(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() admin: UserDocument,
  ) {
    return this.adminService.rejectWithdrawal(id, reason, admin._id.toString());
  }

  @Get('audit-logs')
  async getAuditLogs(
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
    @Query('action') action?: string,
  ) {
    return this.adminService.getAuditLogs(Number(limit), Number(offset), action);
  }
}
