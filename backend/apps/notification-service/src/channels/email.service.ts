import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    } else {
      this.logger.warn('SENDGRID_API_KEY not set. Email sending will fail/mock.');
    }
  }

  async sendWelcomeEmail(to: string, username: string) {
    if (!this.configService.get<string>('SENDGRID_API_KEY')) {
        this.logger.log(`[Mock Email] Welcome to ${to}`);
        return;
    }

    const msg = {
      to,
      from: 'noreply@antesocial.io', // Verify sender in SendGrid
      subject: 'Welcome to Ante Social',
      text: `Hello ${username}, welcome to Ante Social!`,
      html: `<strong>Hello ${username}</strong>, welcome to Ante Social!`,
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Sent welcome email to ${to}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${to}`, error);
    }
  }

  async sendVerificationEmail(to: string, code: string) {
     if (!this.configService.get<string>('SENDGRID_API_KEY')) {
        this.logger.log(`[Mock Email] Verify ${to} with code ${code}`);
        return;
    }
    // ... Implementation similar to above
  }
}
