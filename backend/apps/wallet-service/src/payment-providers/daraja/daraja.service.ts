import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WalletService } from '../../wallet/wallet.service';

@Injectable()
export class DarajaService {
  private readonly logger = new Logger(DarajaService.name);
  private tokenCache: { token: string; expiry: number } | null = null;

  constructor(
    private configService: ConfigService,
    private walletService: WalletService,
  ) {}

  async getAccessToken() {
    if (this.tokenCache && Date.now() < this.tokenCache.expiry) {
      return this.tokenCache.token;
    }

    const consumerKey = this.configService.get('DARAJA_CONSUMER_KEY');
    const consumerSecret = this.configService.get('DARAJA_CONSUMER_SECRET');
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const baseUrl = this.configService.get('DARAJA_BASE_URL', 'https://sandbox.safaricom.co.ke');
    const url = `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`;

    try {
      const { data } = await axios.get(url, {
        headers: { Authorization: `Basic ${auth}` },
      });
      this.tokenCache = {
        token: data.access_token,
        expiry: Date.now() + (parseInt(data.expires_in) - 60) * 1000,
      };
      return data.access_token;
    } catch (error: any) {
      this.logger.error('Failed to get Daraja access token', error.message);
      throw new BadRequestException('Payment provider error');
    }
  }

  // ─── STK Push (Deposit) ─────────────────────────────
  async initiateStkPush(userId: string, phoneNumber: string, amount: number) {
    const token = await this.getAccessToken();
    const baseUrl = this.configService.get('DARAJA_BASE_URL', 'https://sandbox.safaricom.co.ke');
    const shortcode = this.configService.get('DARAJA_SHORTCODE');
    const passkey = this.configService.get('DARAJA_PASSKEY');
    const callbackUrl = this.configService.get('DARAJA_CALLBACK_URL');

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    try {
      const { data } = await axios.post(
        `${baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: callbackUrl,
          AccountReference: `ANTE-${userId.slice(-6)}`,
          TransactionDesc: 'Ante Social Deposit',
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      this.logger.log(`STK Push initiated for user ${userId}`, data);
      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        message: 'STK Push sent to your phone. Please enter your M-Pesa PIN.',
      };
    } catch (error: any) {
      this.logger.error('STK Push failed', error.response?.data || error.message);
      throw new BadRequestException('Failed to initiate M-Pesa payment');
    }
  }

  // ─── STK Push Callback ──────────────────────────────
  async handleStkCallback(data: any) {
    this.logger.log('STK Push Callback received', JSON.stringify(data));

    const result = data?.Body?.stkCallback;
    if (!result) return { ResultCode: 1, ResultDesc: 'Invalid callback' };

    if (result.ResultCode === 0) {
      // Payment successful
      const metadata = result.CallbackMetadata?.Item || [];
      const amount = metadata.find((i: any) => i.Name === 'Amount')?.Value;
      const receipt = metadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
      const phone = metadata.find((i: any) => i.Name === 'PhoneNumber')?.Value;

      this.logger.log(`Payment confirmed: ${receipt} - KSH ${amount} from ${phone}`);
      
      // Credit the user's wallet - need to resolve userId from phone/reference
      // In production: look up pending transaction by CheckoutRequestID
    } else {
      this.logger.warn(`STK Push failed: ${result.ResultDesc}`);
    }

    return { ResultCode: 0, ResultDesc: 'Accepted' };
  }

  // ─── B2C (Withdrawal) ──────────────────────────────
  async initiateB2C(userId: string, phoneNumber: string, amount: number) {
    const token = await this.getAccessToken();
    const baseUrl = this.configService.get('DARAJA_BASE_URL', 'https://sandbox.safaricom.co.ke');
    const shortcode = this.configService.get('DARAJA_B2C_SHORTCODE');
    const initiatorName = this.configService.get('DARAJA_INITIATOR_NAME');
    const securityCredential = this.configService.get('DARAJA_SECURITY_CREDENTIAL');

    try {
      const { data } = await axios.post(
        `${baseUrl}/mpesa/b2c/v3/paymentrequest`,
        {
          OriginatorConversationID: `ANTE-${userId}-${Date.now()}`,
          InitiatorName: initiatorName,
          SecurityCredential: securityCredential,
          CommandID: 'BusinessPayment',
          Amount: amount,
          PartyA: shortcode,
          PartyB: phoneNumber,
          Remarks: 'Ante Social Withdrawal',
          QueueTimeOutURL: this.configService.get('DARAJA_B2C_TIMEOUT_URL'),
          ResultURL: this.configService.get('DARAJA_B2C_RESULT_URL'),
          Occasion: `Withdrawal-${userId.slice(-6)}`,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      this.logger.log(`B2C initiated for user ${userId}`, data);
      return { success: true, conversationId: data.ConversationID };
    } catch (error: any) {
      this.logger.error('B2C failed', error.response?.data || error.message);
      throw new BadRequestException('Failed to process withdrawal');
    }
  }

  // ─── B2C Result Callback ────────────────────────────
  async handleB2CResult(data: any) {
    this.logger.log('B2C Result received', JSON.stringify(data));
    const result = data?.Result;
    if (!result) return { ResultCode: 1, ResultDesc: 'Invalid callback' };

    if (result.ResultCode === 0) {
      this.logger.log(`B2C successful: ${result.ConversationID}`);
      // Mark withdrawal transaction as completed
    } else {
      this.logger.warn(`B2C failed: ${result.ResultDesc}`);
      // Mark withdrawal as failed, refund pending balance
    }

    return { ResultCode: 0, ResultDesc: 'Accepted' };
  }

  // ─── B2C Timeout Callback ──────────────────────────
  async handleB2CTimeout(data: any) {
    this.logger.log('B2C Timeout received', JSON.stringify(data));
    // Mark the withdrawal as failed due to timeout, refund pending
    return { ResultCode: 0, ResultDesc: 'Accepted' };
  }
}
