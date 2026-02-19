import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AnalyticsService } from '../analytics/analytics.service';
import { ComplianceService } from '../compliance/compliance.service';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminController],
  providers: [AdminService, AnalyticsService, ComplianceService],
})
export class AdminModule {}
