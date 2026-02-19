import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as qrcode from 'qrcode';
import { User, UserDocument } from '@app/database';
import { Verify2FADto } from '@app/common'; // We made this earlier
import { AuthService } from '../auth/auth.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const otplibModule = require('otplib') as { authenticator?: any; default?: { authenticator?: any } };
const authenticator = otplibModule.authenticator || otplibModule.default?.authenticator;

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {
    if (authenticator) {
      authenticator.options = { window: 1 }; // Allow 30sec slack
    }
  }

  async generateSecret(user: UserDocument) {
    if (!authenticator) {
      throw new BadRequestException('2FA provider is not configured');
    }

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'AnteSocial', secret);

    // Generate QR Code
    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

    // Save secret temporarily (or permanently if you prefer flow to be atomic)
    // For this flow, we'll save it but not enable it yet
    user.twoFactorSecret = secret;
    await user.save();

    return {
      secret,
      qrCodeDataUrl,
    };
  }

  async verifyAndEnable(user: UserDocument, code: string) {
    if (!authenticator) {
      throw new BadRequestException('2FA provider is not configured');
    }

    if (!user.twoFactorSecret) {
      throw new BadRequestException('2FA setup not initiated');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    user.twoFactorEnabled = true;
    user.backupCodes = this.generateBackupCodes();
    await user.save();

    return { success: true, backupCodes: user.backupCodes };
  }

  async validateForLogin(userId: string, code: string) {
    if (!authenticator) {
      throw new UnauthorizedException('2FA provider unavailable');
    }

    const user = await this.userModel.findById(userId);
    if (!user?.twoFactorSecret) {
      throw new UnauthorizedException('2FA not enabled');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      // Check backup codes
      if (user.backupCodes.includes(code)) {
        // Consume backup code
        user.backupCodes = user.backupCodes.filter((c) => c !== code);
        await user.save();
        return this.authService.login(user);
      }
      throw new UnauthorizedException('Invalid 2FA code');
    }

    return this.authService.login(user); // Issue fresh token
  }

  private generateBackupCodes() {
    return Array.from({ length: 10 }, () => 
      Math.floor(100000 + Math.random() * 900000).toString()
    );
  }
}
