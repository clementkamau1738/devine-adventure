import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  MpesaAuthResponse,
  StkPushInput,
  StkPushResponse,
  StkQueryResponse,
} from './mpesa.types';

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);

  constructor(private config: ConfigService) {}

  private get baseUrl() {
    return this.config.get<string>('MPESA_ENVIRONMENT') === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }

  async getAccessToken(): Promise<string> {
    const key = this.config.get<string>('MPESA_CONSUMER_KEY');
    const secret = this.config.get<string>('MPESA_CONSUMER_SECRET');
    const credentials = Buffer.from(`${key}:${secret}`).toString('base64');

    const response = await axios.get<MpesaAuthResponse>(
      `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${credentials}` } },
    );
    return response.data.access_token;
  }

  async initiateStkPush(input: StkPushInput): Promise<StkPushResponse> {
    const { phone, amount, accountRef, description } = input;
    const token = await this.getAccessToken();

    const shortcode = this.config.get<string>('MPESA_SHORTCODE');
    const passkey = this.config.get<string>('MPESA_PASSKEY');
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      'base64',
    );

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount),
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: this.config.get<string>('MPESA_CALLBACK_URL'),
      AccountReference: accountRef,
      TransactionDesc: description,
    };

    try {
      const response = await axios.post<StkPushResponse>(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          'STK Push failed',
          error.response?.data ?? error.message,
        );
      } else {
        this.logger.error('STK Push failed', error);
      }
      throw error;
    }
  }

  async queryTransaction(checkoutRequestId: string): Promise<StkQueryResponse> {
    const token = await this.getAccessToken();
    const shortcode = this.config.get<string>('MPESA_SHORTCODE');
    const passkey = this.config.get<string>('MPESA_PASSKEY');
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      'base64',
    );

    const response = await axios.post<StkQueryResponse>(
      `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  }
}
