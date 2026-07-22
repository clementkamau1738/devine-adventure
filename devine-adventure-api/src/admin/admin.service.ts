import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  BookingStatus,
  PaymentStatus,
  Prisma,
  Role,
  SubscriptionStatus,
} from '@prisma/client';
import { CreateEventDto } from '../events/dto/create-event.dto';
import { UpdateEventDto } from '../events/dto/update-event.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
    private notificationsService: NotificationsService,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalEvents,
      totalBookings,
      activeSubscriptions,
      totalRevenue,
      recentBookings,
      upcomingEvents,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.event.count({ where: { isPublished: true } }),
      this.prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      this.prisma.subscription.count({
        where: { status: SubscriptionStatus.ACTIVE },
      }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.PAID },
        _sum: { amount: true },
      }),
      this.prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          event: { select: { title: true } },
        },
      }),
      this.prisma.event.findMany({
        where: { isPublished: true, dateTime: { gte: new Date() } },
        orderBy: { dateTime: 'asc' },
        take: 5,
        select: {
          id: true,
          title: true,
          dateTime: true,
          enrolled: true,
          capacity: true,
        },
      }),
    ]);

    return {
      kpis: {
        totalUsers,
        totalEvents,
        totalBookings,
        activeSubscriptions,
        totalRevenue: Number(totalRevenue._sum.amount ?? 0),
      },
      recentBookings,
      upcomingEvents,
    };
  }

  async getRevenueAnalytics(from?: string, to?: string) {
    const where: Prisma.PaymentWhereInput = { status: PaymentStatus.PAID };
    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      };
    }

    const [payments, byMethod] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          booking: {
            include: { event: { select: { title: true, category: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.groupBy({
        by: ['method'],
        where,
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    return { total, byMethod, payments };
  }

  async getAllEvents(opts: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = opts;
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { bookings: true } } },
      }),
      this.prisma.event.count(),
    ]);
    return { events, meta: { total, page, limit } };
  }

  async createEvent(dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  async updateEvent(id: string, dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  async deleteEvent(id: string) {
    return this.eventsService.remove(id);
  }

  async toggleEventPublish(id: string, isPublished: boolean) {
    const event = await this.prisma.event.update({
      where: { id },
      data: { isPublished },
    });

    if (isPublished) {
      this.notificationsService.notifyNewEvent(event);
    }

    return event;
  }

  async getUsers(opts: { role?: string; page?: number }) {
    const { role, page = 1 } = opts;
    const skip = (page - 1) * 20;
    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role as Role;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: 20,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isVerified: true,
          createdAt: true,
          _count: { select: { bookings: true, subscriptions: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { users, meta: { total, page } };
  }

  async updateUserRole(userId: string, role: Role) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async getAllBookings(opts: { status?: string; page?: number }) {
    const { status, page = 1 } = opts;
    const skip = (page - 1) * 20;
    const where: Prisma.BookingWhereInput = {};
    if (status) where.status = status as BookingStatus;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: 20,
        include: {
          user: { select: { name: true, email: true, phone: true } },
          event: { select: { title: true, dateTime: true } },
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where }),
    ]);
    return { bookings, meta: { total, page } };
  }

  async exportBookingsCSV(from?: string, to?: string) {
    const where: Prisma.BookingWhereInput = {};
    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      };
    }

    const bookings = await this.prisma.booking.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        event: { select: { title: true, dateTime: true } },
      },
    });

    const rows = bookings.map((b) => ({
      Reference: b.referenceCode,
      User: b.user.name,
      Email: b.user.email,
      Phone: b.user.phone,
      Event: b.event.title,
      Date: b.event.dateTime.toISOString(),
      Amount: Number(b.totalAmount),
      Discount: Number(b.discountApplied),
      Status: b.status,
      PaymentStatus: b.paymentStatus,
      BookedAt: b.createdAt.toISOString(),
    }));

    return rows; // Controller streams as CSV
  }

  async getSubscriptions(status?: string) {
    const where: Prisma.SubscriptionWhereInput = {};
    if (status) where.status = status as SubscriptionStatus;
    return this.prisma.subscription.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async adminCancelSubscription(id: string) {
    return this.prisma.subscription.update({
      where: { id },
      data: { status: SubscriptionStatus.CANCELLED },
    });
  }
}
