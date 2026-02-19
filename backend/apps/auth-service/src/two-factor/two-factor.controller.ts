import { Controller, Post, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { TwoFactorService } from './two-factor.service';
import { JwtAuthGuard, CurrentUser, Verify2FADto } from '@app/common';
import { UserDocument } from '@app/database';

@Controller('auth/2fa')
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @UseGuards(JwtAuthGuard)
  @Post('setup')
  async setup(@CurrentUser() user: UserDocument) {
    return this.twoFactorService.generateSecret(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('enable')
  async enable(@CurrentUser() user: UserDocument, @Body() body: Verify2FADto) {
    return this.twoFactorService.verifyAndEnable(user, body.token);
  }

  @Post('verify')
  async verify(@Body() body: { userId: string; token: string }) {
    // This endpoint handles the 2nd step of login
    return this.twoFactorService.validateForLogin(body.userId, body.token);
  }
}
