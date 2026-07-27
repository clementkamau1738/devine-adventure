# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

This is a monorepo (two independent npm projects, no workspace tooling — `npm install` separately in each):

- `devine-adventure-api/` — NestJS 11 + Prisma + PostgreSQL REST API
- `devine-adventure-web/` — Next.js 16 (App Router) frontend

Each has its own `CLAUDE.md`/`AGENTS.md` with details specific to that side; this file covers the parts that span both.

## Commands

**API** (`cd devine-adventure-api`):
- `npm run start:dev` — watch-mode dev server (port 3001)
- `npm run build` — `nest build`
- `npm run lint` — ESLint with `--fix`
- `npm test` — Jest unit tests (`*.spec.ts` colocated in `src/`)
- `npm run test:e2e` — e2e tests (`test/*.e2e-spec.ts`)
- `npx jest src/path/to/file.spec.ts` — run a single test file
- `npx prisma migrate dev` — apply/create a migration against `DATABASE_URL`
- `npx prisma studio` — inspect the database
- `npx prisma db seed` — run `prisma/seed.ts`
- `docker-compose up postgres` — local Postgres only (the `api` service in `docker-compose.yml` is for containerized deploy, not day-to-day dev)

**Web** (`cd devine-adventure-web`):
- `npm run dev` — Next dev server with Turbopack (port 3000)
- `npm run build` / `npm run start` — production build/run
- `npm run lint` — ESLint flat config
- `npx tsc --noEmit` — type check (no dedicated script)
- No test runner is configured in this project.

There is no root-level script runner — always `cd` into the relevant package first.

## Architecture

Devine Adventure is a Kenyan outdoor-adventure booking platform (hikes, bike rides, private trips, training) with membership-based pricing. The web app is a pure client of the API over `NEXT_PUBLIC_API_URL`; all persistence, auth, and payment logic lives in `devine-adventure-api`.

### API (`devine-adventure-api`)

Standard Nest module-per-domain layout under `src/`: `auth`, `users`, `events`, `bookings`, `subscriptions`, `payments`, `notifications`, `admin`, plus `prisma` (a global `PrismaService` wrapping `@prisma/client`) and `common` (shared filters/interceptors/decorators). Routes are mounted under global prefix `api/v1`; Swagger docs are served at `api/docs`.

**Auth**: JWT access + refresh tokens via Passport (`JwtStrategy`, `JwtRefreshStrategy`, `LocalStrategy` in `auth/strategies/`). `RolesGuard` (`auth/guards/roles.guard.ts`) checks a `@Roles()` decorator against `Role` (`GUEST | MEMBER | ADMIN`) read off `request.user`. Refresh tokens are stored hashed on the `User` row.

**Response shape**: every response is wrapped by the global `TransformInterceptor` (`common/interceptors/transform.interceptor.ts`) into `{ success, data, timestamp }`; all uncaught errors funnel through `AllExceptionsFilter` (`common/filters/all-exceptions.filter.ts`) into `{ success: false, statusCode, path, message, timestamp }`. The frontend's type definitions and API client assume exactly this envelope — don't change it without updating `devine-adventure-web/src/types/index.ts` and `src/lib/api.ts` in lockstep.

**Pricing is enforced server-side, not client-side.** `SubscriptionsService.calculateEventPrice(userId, eventId)` (`subscriptions/subscriptions.service.ts`) is the single source of truth for what a user pays for an event (free events, member-only-free events, member discount pricing, etc. — see `PricingResult`). `BookingsService.createBooking` always calls this before writing a booking's `totalAmount`/`discountApplied`; never trust a price passed in from the client. The frontend's `useEventPricing` hook mirrors this only for display purposes.

**Payments**: two providers behind `PaymentsService` (`payments/payments.service.ts`):
- M-Pesa Daraja STK Push via `MpesaService` (`payments/mpesa/`) — `initiateMpesaPayment` creates a `PENDING` `Payment`, sends the STK push, then `handleMpesaCallback` (webhook) flips it to `PAID`/`FAILED` and calls `BookingsService.confirmBooking`.
- Stripe Checkout — `createStripeSession` creates the session + a `PENDING` `Payment`; `handleStripeWebhook` verifies the signature and confirms the booking on `checkout.session.completed`.

Both flows converge on `BookingsService.confirmBooking` as the point where a `Booking` moves to `CONFIRMED`. `Payment.metadata` (Json) holds provider-specific correlation IDs (`checkoutRequestId` for M-Pesa, `stripeSessionId` for Stripe) since it's a polymorphic field across the two providers.

**Data model** (`prisma/schema.prisma`): `User` → `Booking`/`Subscription`/`Payment`; `Event` → `Booking`. Key enums: `Role`, `EventCategory` (`HIKE|BIKE|PRIVATE|TRAINING`), `Difficulty`, `BookingStatus`, `PaymentStatus`, `PlanType` (`MONTHLY|QUARTERLY|ANNUAL`), `PaymentMethod` (`MPESA|CARD`). Membership status (active `Subscription`) is what `calculateEventPrice` checks to decide member pricing — see `SubscriptionsService.isUserActiveMember`.

**Notifications**: `NotificationsService` (`notifications/notifications.service.ts`) wraps Mailchimp Marketing API for audience subscription (e.g. on registration); failures are caught and logged, never thrown, since Mailchimp being down shouldn't break the request that triggered it.

**Config**: all secrets/URLs come from `.env` via `@nestjs/config` (`ConfigService`), see `.env.example` for the full list (JWT secrets, M-Pesa Daraja credentials, Stripe keys, Mailchimp, AWS S3). `ThrottlerModule` is applied globally (100 req/min) via `APP_GUARD`.

### Web (`devine-adventure-web`)

See `devine-adventure-web/CLAUDE.md` for full detail. In brief: App Router pages under `src/app/(public)/...`; server state (events/bookings/subscriptions) via TanStack Query hooks in `src/hooks/`; client state via two Zustand stores in `src/store/` (`auth.store.ts` persisted, `booking.store.ts` ephemeral); single axios instance in `src/lib/api.ts` handling bearer auth + refresh-on-401. Tailwind v4 with CSS-based config (no `tailwind.config`), dark theme by default.

**This project pins bleeding-edge versions** (`next@16`, `react@19`, `tailwindcss@4`) newer than most training data — check `node_modules/next/dist/docs/` before relying on remembered Next.js APIs/conventions.

## Cross-cutting notes

- Currency is Kenyan Shillings (KES) throughout — `formatKES` on the frontend, `Decimal(10,2)` fields on the backend.
- Keep the `ApiResponse<T>`/`PaginatedResponse<T>` envelope and the domain types (`Event`, `Booking`, `Subscription`, `PricingResult`) in sync between `devine-adventure-api`'s DTOs/entities and `devine-adventure-web/src/types/index.ts` when changing either side.
- `FRONTEND_URL` (API env) and `NEXT_PUBLIC_API_URL` (web env) must point at each other for CORS and redirects (Stripe success/cancel URLs, refresh-failure redirect) to work in dev.
