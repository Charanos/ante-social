import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    this.fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL') || 'noreply@antesocial.io';

    if (apiKey) {
      sgMail.setApiKey(apiKey);
    } else {
      this.logger.warn('SENDGRID_API_KEY not set. Email sending will fail/mock.');
    }
  }

  async sendWelcomeEmail(to: string, username: string) {
    await this.sendEmail({
      to,
      subject: 'Welcome to Ante Social',
      text: `Hello ${username}, welcome to Ante Social!`,
      html: `<strong>Hello ${username}</strong>, welcome to Ante Social!`,
    });
  }

  async sendVerificationEmail(to: string, code: string) {
    await this.sendEmail({
      to,
      subject: 'Ante Social verification',
      text: code,
      html: `<p>${code}</p>`,
    });
  }

  async sendNotificationEmail(to: string, title: string, message: string) {
    await this.sendEmail({
      to,
      subject: title,
      text: message,
      html: `<p>${message}</p>`,
    });
  }

  private async sendEmail(payload: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }) {
    if (!this.configService.get<string>('SENDGRID_API_KEY')) {
      this.logger.log(`[Mock Email] ${payload.subject} -> ${payload.to}`);
      return;
    }

    try {
      await sgMail.send({
        to: payload.to,
        from: this.fromEmail,
        subject: payload.subject,
        text: payload.text,
        html: payload.html || payload.text,
      });
      this.logger.log(`Sent email "${payload.subject}" to ${payload.to}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${payload.to}`, error);
    }
  }
}
