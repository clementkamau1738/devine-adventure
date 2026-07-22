import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MpesaService } from './mpesa/mpesa.service';
import { PaymentsController } from './payments.controller';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [BookingsModule],
  providers: [PaymentsService, MpesaService],
  controllers: [PaymentsController],
  exports: [PaymentsService, MpesaService],
})
export class PaymentsModule {}
