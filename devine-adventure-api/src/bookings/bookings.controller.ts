import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  getUserBookings(@CurrentUser() user: { sub: string }) {
    return this.bookingsService.getUserBookings(user.sub);
  }

  @Post()
  initiateBooking(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.initiateBooking({
      userId: user.sub,
      eventId: dto.eventId,
      notes: dto.notes,
    });
  }

  @Get(':ref')
  getBookingByRef(
    @CurrentUser() user: { sub: string },
    @Param('ref') referenceCode: string,
  ) {
    return this.bookingsService.getBookingByRef(referenceCode, user.sub);
  }

  @Delete(':id')
  cancelBooking(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.bookingsService.cancelBooking(id, user.sub);
  }
}
