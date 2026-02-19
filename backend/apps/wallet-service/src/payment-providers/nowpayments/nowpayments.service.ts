import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class NowPaymentsService {
  private readonly logger = new Logger(NowPaymentsService.name);
  private readonly baseUrl = 'https://api.nowpayments.io/v1';

  constructor(private configService: ConfigService) {}

  private get apiKey(): string {
    return this.configService.get<string>('NOWPAYMENTS_API_KEY', '');
  }

  private get ipnSecret(): string {
    return this.configService.get<string>('NOWPAYMENTS_IPN_SECRET', '');
  }

  // ─── Create Payment (Deposit) ──────────────────────
  async createPayment(userId: string, amount: number, currency: string = 'usd') {
    if (!this.apiKey) {
      this.logger.warn('NOWPayments API key not configured');
      throw new BadRequestException('Crypto payments not configured');
    }

    try {
      const { data } = await axios.post(
        `${this.baseUrl}/payment`,
        {
          price_amount: amount,
          price_currency: currency,
          pay_currency: 'btc', // Default to BTC, can be parameterized
          order_id: `ANTE-${userId}-${Date.now()}`,
          order_description: `Ante Social deposit for ${userId}`,
          ipn_callback_url: this.configService.get('NOWPAYMENTS_IPN_URL'),
          success_url: this.configService.get('NOWPAYMENTS_SUCCESS_URL'),
          cancel_url: this.configService.get('NOWPAYMENTS_CANCEL_URL'),
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`Crypto payment created for user ${userId}: ${data.payment_id}`);
      return {
        paymentId: data.payment_id,
        payAddress: data.pay_address,
        payCurrency: data.pay_currency,
        payAmount: data.pay_amount,
        expiresAt: data.expiration_estimate_date,
        status: data.payment_status,
      };
    } catch (error: any) {
      this.logger.error('Failed to create crypto payment', error.response?.data || error.message);
      throw new BadRequestException('Failed to create crypto payment');
    }
  }

  // ─── Check Payment Status ──────────────────────────
  async getPaymentStatus(paymentId: string) {
    try {
      const { data } = await axios.get(`${this.baseUrl}/payment/${paymentId}`, {
        headers: { 'x-api-key': this.apiKey },
      });
      return {
        paymentId: data.payment_id,
        status: data.payment_status,
        actuallyPaid: data.actually_paid,
        payCurrency: data.pay_currency,
      };
    } catch (error: any) {
      this.logger.error(`Failed to check payment ${paymentId}`, error.message);
      throw new BadRequestException('Failed to check payment status');
    }
  }

  // ─── IPN Callback Handler ──────────────────────────
  async handleIpnCallback(body: any, signature: string) {
    // Verify HMAC signature
    const crypto = await import('crypto');
    const hmac = crypto.createHmac('sha512', this.ipnSecret);
    const sortedBody = JSON.stringify(this.sortObject(body));
    const expectedSignature = hmac.update(sortedBody).digest('hex');

    if (signature !== expectedSignature) {
      this.logger.warn('Invalid IPN signature');
      throw new BadRequestException('Invalid signature');
    }

    this.logger.log(`IPN received: payment ${body.payment_id} status ${body.payment_status}`);

    if (body.payment_status === 'finished' || body.payment_status === 'confirmed') {
      // Payment confirmed — credit user wallet
      // Parse userId from order_id: "ANTE-{userId}-{timestamp}"
      const orderId = body.order_id || '';
      const parts = orderId.split('-');
      const userId = parts.length >= 2 ? parts[1] : null;

      if (userId) {
        return {
          success: true,
          userId,
          amount: body.actually_paid,
          currency: body.pay_currency,
          paymentId: body.payment_id,
        };
      }
    }

    return { success: true, status: body.payment_status };
  }

  // ─── Available Currencies ──────────────────────────
  async getAvailableCurrencies() {
    try {
      const { data } = await axios.get(`${this.baseUrl}/currencies`, {
        headers: { 'x-api-key': this.apiKey },
      });
      return data.currencies;
    } catch (error: any) {
      this.logger.error('Failed to get currencies', error.message);
      return [];
    }
  }

  private sortObject(obj: any): any {
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key: string) => {
        result[key] = obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])
          ? this.sortObject(obj[key])
          : obj[key];
        return result;
      }, {});
  }
}
