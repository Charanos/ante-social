import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TwoFactorService } from './two-factor.service';
import { JwtAuthGuard, CurrentUser, Verify2FADto } from '@app/common';

@Controller('auth/2fa')
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @UseGuards(JwtAuthGuard)
  @Post('setup')
  async setup(@CurrentUser('userId') userId: string) {
    return this.twoFactorService.generateSecret(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('enable')
  async enable(@CurrentUser('userId') userId: string, @Body() body: Verify2FADto) {
    return this.twoFactorService.verifyAndEnable(userId, body.token);
  }

  @Post('verify')
  async verify(@Body() body: { userId: string; token: string }) {
    // This endpoint handles the 2nd step of login
    return this.twoFactorService.validateForLogin(body.userId, body.token);
  }
}
