import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { Event, User, Booking } from '@prisma/client';

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private config: ConfigService) {
    try {
      const apiKey = this.config.get<string>('MAILCHIMP_API_KEY');
      const server = this.config.get<string>('MAILCHIMP_SERVER_PREFIX');
      if (apiKey && server) {
        mailchimp.setConfig({ apiKey, server });
      }
    } catch (err) {
      this.logger.error('Failed to configure mailchimp config', err);
    }
  }

  // ── Subscribe to main audience ──────────────────────────────────────────────
  async subscribeToAudience(user: Pick<User, 'email' | 'name' | 'role'>) {
    try {
      const [firstName, ...rest] = user.name.split(' ');
      const listId = this.config.get<string>('MAILCHIMP_LIST_ID');
      if (!listId) {
        this.logger.warn('MAILCHIMP_LIST_ID is not configured');
        return;
      }
      await mailchimp.lists.addListMember(listId, {
        email_address: user.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: rest.join(' '),
          ROLE: user.role,
        },
        tags: [user.role === 'MEMBER' ? 'member' : 'guest'],
      });
    } catch (err) {
      this.logger.warn(`Mailchimp subscribe failed: ${errorMessage(err)}`);
    }
  }

  // ── Booking Confirmation Email ──────────────────────────────────────────────
  async sendBookingConfirmation(user: User, event: Event, booking: Booking) {
    try {
      // Mandrill/Mailchimp transactional messages
      const messages = mailchimp.messages;
      if (!messages) {
        this.logger.warn('Mailchimp messages client is not available');
        return;
      }
      await messages.sendTemplate({
        template_name: 'booking-confirmation',
        template_content: [],
        message: {
          to: [{ email: user.email, name: user.name, type: 'to' }],
          subject: `✅ Booking Confirmed — ${event.title}`,
          from_email: 'hello@devineadventure.co.ke',
          from_name: 'Devine Adventure',
          merge_vars: [
            {
              rcpt: user.email,
              vars: [
                { name: 'USER_NAME', content: user.name },
                { name: 'EVENT_TITLE', content: event.title },
                {
                  name: 'EVENT_DATE',
                  content: new Date(event.dateTime).toLocaleDateString(
                    'en-KE',
                    { dateStyle: 'full' },
                  ),
                },
                { name: 'EVENT_LOCATION', content: event.location },
                { name: 'BOOKING_REF', content: booking.referenceCode },
                {
                  name: 'AMOUNT',
                  content: `KES ${Number(booking.totalAmount).toLocaleString()}`,
                },
              ],
            },
          ],
        },
      });
    } catch (err) {
      this.logger.warn(`Booking email failed: ${errorMessage(err)}`);
    }
  }

  // ── New Event Published ─────────────────────────────────────────────────────
  notifyNewEvent(event: Event) {
    try {
      // Trigger Mailchimp automation / campaign via tag
      this.logger.log(`New event published: ${event.title} — trigger campaign`);
      // In production: create campaign or trigger automation
    } catch (err) {
      this.logger.warn(`New event notification failed: ${errorMessage(err)}`);
    }
  }

  // ── Subscription Renewal Reminder ──────────────────────────────────────────
  async sendRenewalReminder(user: User, daysLeft: number) {
    try {
      const messages = mailchimp.messages;
      if (!messages) {
        this.logger.warn('Mailchimp messages client is not available');
        return;
      }
      await messages.sendTemplate({
        template_name: 'subscription-renewal',
        template_content: [],
        message: {
          to: [{ email: user.email, name: user.name, type: 'to' }],
          subject: `⏰ Your Devine Adventure membership expires in ${daysLeft} days`,
          from_email: 'hello@devineadventure.co.ke',
          from_name: 'Devine Adventure',
          merge_vars: [
            {
              rcpt: user.email,
              vars: [
                { name: 'USER_NAME', content: user.name },
                { name: 'DAYS_LEFT', content: String(daysLeft) },
              ],
            },
          ],
        },
      });
    } catch (err) {
      this.logger.warn(`Renewal reminder failed: ${errorMessage(err)}`);
    }
  }

  // ── Upcoming Event Reminder ─────────────────────────────────────────────────
  async sendUpcomingEventReminder(user: User, event: Event, booking: Booking) {
    try {
      const messages = mailchimp.messages;
      if (!messages) {
        this.logger.warn('Mailchimp messages client is not available');
        return;
      }
      await messages.sendTemplate({
        template_name: 'event-reminder',
        template_content: [],
        message: {
          to: [{ email: user.email, name: user.name, type: 'to' }],
          subject: `🏔️ Your adventure is tomorrow — ${event.title}`,
          from_email: 'hello@devineadventure.co.ke',
          from_name: 'Devine Adventure',
          merge_vars: [
            {
              rcpt: user.email,
              vars: [
                { name: 'USER_NAME', content: user.name },
                { name: 'EVENT_TITLE', content: event.title },
                { name: 'EVENT_LOCATION', content: event.location },
                { name: 'BOOKING_REF', content: booking.referenceCode },
              ],
            },
          ],
        },
      });
    } catch (err) {
      this.logger.warn(`Event reminder failed: ${errorMessage(err)}`);
    }
  }
}
