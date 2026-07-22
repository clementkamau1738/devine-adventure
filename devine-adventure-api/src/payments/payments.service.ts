import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MpesaService } from './mpesa/mpesa.service';
import { BookingsService } from '../bookings/bookings.service';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { nanoid } from 'nanoid';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { MpesaCallbackBody } from './mpesa/mpesa.types';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private mpesa: MpesaService,
    private bookingsService: BookingsService,
    private config: ConfigService,
  ) {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(secretKey || 'mock_secret_key', {
      apiVersion: '2026-06-24.dahlia',
    });
  }

  // ─── M-PESA ──────────────────────────────────────────────────────────────────

  async initiateMpesaPayment(userId: string, bookingId: string, phone: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: { event: true },
    });
    if (!booking) throw new BadRequestException('Booking not found');
    if (Number(booking.totalAmount) === 0)
      throw new BadRequestException('No payment required');

    const transactionRef = `MP-${nanoid(10).toUpperCase()}`;

    // Create pending payment record
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        bookingId,
        amount: booking.totalAmount,
        method: PaymentMethod.MPESA,
        transactionRef,
        status: PaymentStatus.PENDING,
        metadata: { checkoutRequestId: null, phone },
      },
    });

    // Initiate STK Push
    const stkResponse = await this.mpesa.initiateStkPush({
      phone: phone.replace('+', ''),
      amount: Number(booking.totalAmount),
      accountRef: booking.referenceCode,
      description: `Devine Adventure: ${booking.event.title}`,
    });

    // Store checkout request ID for polling
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        metadata: {
          checkoutRequestId: stkResponse.CheckoutRequestID,
          merchantRequestId: stkResponse.MerchantRequestID,
          phone,
        },
      },
    });

    return {
      paymentId: payment.id,
      transactionRef,
      checkoutRequestId: stkResponse.CheckoutRequestID,
      message: 'STK Push sent. Enter your M-Pesa PIN to complete payment.',
    };
  }

  async handleMpesaCallback(body: MpesaCallbackBody) {
    const { Body } = body;
    const result = Body.stkCallback;

    const meta = result.CallbackMetadata?.Item ?? [];
    const getValue = (name: string) => meta.find((i) => i.Name === name)?.Value;

    const checkoutRequestId = result.CheckoutRequestID;
    const resultCode = result.ResultCode;

    const payment = await this.prisma.payment.findFirst({
      where: {
        metadata: { path: ['checkoutRequestId'], equals: checkoutRequestId },
      },
    });
    if (!payment) {
      this.logger.warn(
        `Payment not found for CheckoutRequestID: ${checkoutRequestId}`,
      );
      return;
    }

    if (resultCode === 0) {
      // Success
      const mpesaRef = getValue('MpesaReceiptNumber');
      const mpesaRefStr = mpesaRef !== undefined ? String(mpesaRef) : undefined;
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PAID,
          mpesaReceiptNo: mpesaRefStr,
          transactionRef: mpesaRefStr ?? payment.transactionRef,
        },
      });

      if (payment.bookingId) {
        await this.bookingsService.confirmBooking(payment.bookingId);
      }
    } else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
    }
  }

  // ─── STRIPE ──────────────────────────────────────────────────────────────────

  async createStripeSession(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: { event: true, user: true },
    });
    if (!booking) throw new BadRequestException('Booking not found');

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'kes',
            product_data: {
              name: booking.event.title,
              description: booking.event.location,
            },
            unit_amount: Math.ceil(Number(booking.totalAmount)) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: booking.user.email,
      metadata: { bookingId, userId },
      success_url: `${this.config.get('FRONTEND_URL')}/booking/success?ref=${booking.referenceCode}`,
      cancel_url: `${this.config.get('FRONTEND_URL')}/booking/cancel?ref=${booking.referenceCode}`,
    });

    const transactionRef = `STR-${nanoid(10).toUpperCase()}`;
    await this.prisma.payment.create({
      data: {
        userId,
        bookingId,
        amount: booking.totalAmount,
        method: PaymentMethod.CARD,
        transactionRef,
        status: PaymentStatus.PENDING,
        metadata: { stripeSessionId: session.id },
      },
    });

    return { sessionId: session.id, sessionUrl: session.url };
  }

  async handleStripeWebhook(payload: Buffer, signature: string) {
    const secret = this.config.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, secret);
    } catch {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      await this.prisma.payment.updateMany({
        where: { metadata: { path: ['stripeSessionId'], equals: session.id } },
        data: {
          status: PaymentStatus.PAID,
          transactionRef: session.payment_intent as string,
        },
      });

      if (bookingId) await this.bookingsService.confirmBooking(bookingId);
    }
  }

  async getUserPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: { booking: { include: { event: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
