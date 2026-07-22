import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { nanoid } from 'nanoid';

export interface CreateBookingInput {
  userId: string;
  eventId: string;
  notes?: string;
}

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private subscriptionsService: SubscriptionsService,
    private notificationsService: NotificationsService,
  ) {}

  async initiateBooking(input: CreateBookingInput) {
    const { userId, eventId, notes } = input;

    // 1. Check event exists and is published
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event || !event.isPublished)
      throw new NotFoundException('Event not found');

    // 2. Check capacity
    if (event.enrolled >= event.capacity) {
      throw new BadRequestException('This event is fully booked');
    }

    // 3. Check duplicate booking
    const existing = await this.prisma.booking.findFirst({
      where: {
        userId,
        eventId,
        status: { notIn: [BookingStatus.CANCELLED] },
      },
    });
    if (existing)
      throw new ConflictException('You have already booked this event');

    // 4. SERVER-SIDE pricing (this is the enforcement point)
    const pricing = await this.subscriptionsService.calculateEventPrice(
      userId,
      eventId,
    );

    // 5. Generate unique reference
    const referenceCode = `DA-${nanoid(8).toUpperCase()}`;

    // 6. Create pending booking
    const booking = await this.prisma.booking.create({
      data: {
        referenceCode,
        userId,
        eventId,
        status: BookingStatus.PENDING,
        paymentStatus:
          pricing.finalPrice === 0 ? PaymentStatus.PAID : PaymentStatus.PENDING,
        totalAmount: pricing.finalPrice,
        discountApplied: pricing.discount,
        notes,
      },
      include: { event: true, user: true },
    });

    // 7. If free, auto-confirm
    if (pricing.finalPrice === 0) {
      await this.confirmBooking(booking.id);
      return { booking, pricing, requiresPayment: false };
    }

    return { booking, pricing, requiresPayment: true };
  }

  async confirmBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { event: true, user: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
      },
    });

    // Increment enrolled count
    await this.prisma.event.update({
      where: { id: booking.eventId },
      data: { enrolled: { increment: 1 } },
    });

    // Send confirmation email
    await this.notificationsService.sendBookingConfirmation(
      booking.user,
      booking.event,
      updated,
    );

    return updated;
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
    });

    if (booking.status === BookingStatus.CONFIRMED) {
      await this.prisma.event.update({
        where: { id: booking.eventId },
        data: { enrolled: { decrement: 1 } },
      });
    }

    return updated;
  }

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingByRef(referenceCode: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { referenceCode, userId },
      include: { event: true, payment: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  // Runs daily: email confirmed bookings for events happening tomorrow
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendUpcomingEventReminders() {
    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() + 1);
    windowStart.setHours(0, 0, 0, 0);
    const windowEnd = new Date(windowStart);
    windowEnd.setDate(windowEnd.getDate() + 1);

    const upcoming = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.CONFIRMED,
        event: { dateTime: { gte: windowStart, lt: windowEnd } },
      },
      include: { event: true, user: true },
    });

    for (const booking of upcoming) {
      await this.notificationsService.sendUpcomingEventReminder(
        booking.user,
        booking.event,
        booking,
      );
    }

    return { reminded: upcoming.length };
  }
}
