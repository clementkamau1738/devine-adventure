import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Headers,
  BadRequestException,
  type RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import type { MpesaCallbackBody } from './mpesa/mpesa.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { Request } from 'express';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getUserPayments(@CurrentUser() user: { sub: string }) {
    return this.paymentsService.getUserPayments(user.sub);
  }

  @Post('mpesa/initiate/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  initiateMpesa(
    @CurrentUser() user: { sub: string },
    @Param('bookingId') bookingId: string,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiateMpesaPayment(
      user.sub,
      bookingId,
      dto.phone,
    );
  }

  // Webhook — no auth, verified by Safaricom IP/signature
  @Post('mpesa/callback')
  mpesaCallback(@Body() body: MpesaCallbackBody) {
    return this.paymentsService.handleMpesaCallback(body);
  }

  @Post('stripe/session/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createStripeSession(
    @CurrentUser() user: { sub: string },
    @Param('bookingId') bookingId: string,
  ) {
    return this.paymentsService.createStripeSession(user.sub, bookingId);
  }

  @Post('stripe/webhook')
  stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!req.rawBody) throw new BadRequestException('Missing raw request body');
    return this.paymentsService.handleStripeWebhook(req.rawBody, signature);
  }
}
