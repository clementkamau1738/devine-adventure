import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PlanType, SubscriptionStatus, Role } from '@prisma/client';

export interface PricingResult {
  originalPrice: number;
  finalPrice: number;
  discount: number;
  isFreeForMember: boolean;
  reason: string;
}

// Subscription plan pricing (KES)
export const PLAN_PRICES: Record<PlanType, number> = {
  MONTHLY: 2500,
  QUARTERLY: 6500,
  ANNUAL: 22000,
};

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async getUserActiveSubscription(userId: string) {
    return this.prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        endDate: { gte: new Date() },
      },
      orderBy: { endDate: 'desc' },
    });
  }

  async isUserActiveMember(userId: string): Promise<boolean> {
    const sub = await this.getUserActiveSubscription(userId);
    return !!sub;
  }

  /**
   * CORE PRICING LOGIC — enforced server-side
   * This is the single source of truth for all pricing decisions
   */
  async calculateEventPrice(
    userId: string,
    eventId: string,
  ): Promise<PricingResult> {
    const [event, isActiveMember] = await Promise.all([
      this.prisma.event.findUnique({ where: { id: eventId } }),
      this.isUserActiveMember(userId),
    ]);

    if (!event) throw new NotFoundException('Event not found');

    const originalPrice = Number(event.price);

    // Rule 1: Free events are free for everyone
    if (event.isFree) {
      return {
        originalPrice,
        finalPrice: 0,
        discount: originalPrice,
        isFreeForMember: false,
        reason: 'Free event — no charge',
      };
    }

    // Rule 2: Member with memberPrice = 0 gets it free
    if (
      isActiveMember &&
      event.memberPrice !== null &&
      Number(event.memberPrice) === 0
    ) {
      return {
        originalPrice,
        finalPrice: 0,
        discount: originalPrice,
        isFreeForMember: true,
        reason: 'Included with your membership',
      };
    }

    // Rule 3: Member with discounted memberPrice
    if (
      isActiveMember &&
      event.memberPrice !== null &&
      Number(event.memberPrice) > 0
    ) {
      const memberPrice = Number(event.memberPrice);
      return {
        originalPrice,
        finalPrice: memberPrice,
        discount: originalPrice - memberPrice,
        isFreeForMember: false,
        reason: 'Member discount applied',
      };
    }

    // Rule 4: Guest — full price
    return {
      originalPrice,
      finalPrice: originalPrice,
      discount: 0,
      isFreeForMember: false,
      reason: 'Standard price',
    };
  }

  async createSubscription(userId: string, planType: PlanType) {
    const existing = await this.getUserActiveSubscription(userId);
    if (existing) {
      throw new ConflictException('You already have an active subscription');
    }

    const startDate = new Date();
    const endDate = this.calculateEndDate(startDate, planType);
    const amount = PLAN_PRICES[planType];

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planType,
        startDate,
        endDate,
        amount,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    // Upgrade user role
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.MEMBER },
    });

    return subscription;
  }

  async cancelSubscription(userId: string, subscriptionId: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, userId, status: SubscriptionStatus.ACTIVE },
    });
    if (!sub) throw new NotFoundException('Active subscription not found');

    const updated = await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: SubscriptionStatus.CANCELLED },
    });

    // Check if any other active subs remain
    const otherActive = await this.getUserActiveSubscription(userId);
    if (!otherActive) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: Role.GUEST },
      });
    }

    return updated;
  }

  async getUserSubscriptions(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Runs daily: mark expired subscriptions and downgrade lapsed members
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processExpiredSubscriptions() {
    const expired = await this.prisma.subscription.updateMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: { lt: new Date() },
      },
      data: { status: SubscriptionStatus.EXPIRED },
    });

    // Downgrade expired members
    const expiredSubs = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.EXPIRED,
        updatedAt: { gte: new Date(Date.now() - 60000) },
      },
      select: { userId: true },
    });

    for (const { userId } of expiredSubs) {
      const active = await this.getUserActiveSubscription(userId);
      if (!active) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { role: Role.GUEST },
        });
      }
    }

    if (expired.count > 0) {
      this.logger.log(
        `Expired ${expired.count} subscription(s), downgraded ${expiredSubs.length} member(s)`,
      );
    }

    return { processed: expired.count };
  }

  // Runs daily: email members whose subscription expires in 7 days
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendRenewalReminders() {
    const daysLeft = 7;
    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() + daysLeft);
    windowStart.setHours(0, 0, 0, 0);
    const windowEnd = new Date(windowStart);
    windowEnd.setDate(windowEnd.getDate() + 1);

    const expiringSoon = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: { gte: windowStart, lt: windowEnd },
      },
      include: { user: true },
    });

    for (const sub of expiringSoon) {
      await this.notificationsService.sendRenewalReminder(sub.user, daysLeft);
    }

    return { reminded: expiringSoon.length };
  }

  private calculateEndDate(start: Date, plan: PlanType): Date {
    const end = new Date(start);
    if (plan === PlanType.MONTHLY) end.setMonth(end.getMonth() + 1);
    if (plan === PlanType.QUARTERLY) end.setMonth(end.getMonth() + 3);
    if (plan === PlanType.ANNUAL) end.setFullYear(end.getFullYear() + 1);
    return end;
  }
}
