# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server (Next.js, Turbopack)
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- `npx tsc --noEmit` — type check (no dedicated `typecheck` script)

There is no test runner configured in this repo (no test script, no test files).

## Architecture

Devine Adventure is a frontend-only Next.js 16 (App Router) client for a Kenyan outdoor-adventure booking platform (hikes, bike rides, private trips, training). It talks to a separate backend REST API over `NEXT_PUBLIC_API_URL` — there is no server-side data layer in this repo beyond that HTTP client.

**Routing**: pages live under `src/app/(public)/...` (route group, no URL segment) — e.g. `events/`, `events/[slug]/`, `booking/[eventId]/`, `booking/checkout/`, `membership/`. Root layout (`src/app/layout.tsx`) sets fonts (Inter + Playfair Display via `next/font/google`) and wraps everything in `Providers`.

**State is split two ways, don't mix them**:
- **Server state** (events, bookings, subscriptions) goes through TanStack Query hooks in `src/hooks/` (`useEvents.ts`, `useBookings.ts`, `useSubscription.ts`). Each file exports a `*Keys` query-key factory and thin `useQuery`/`useMutation` wrappers around `src/lib/api.ts`. Mutations invalidate via `queryClient.invalidateQueries`.
- **Client state** is two Zustand stores in `src/store/`: `auth.store.ts` (persisted to localStorage under key `devine-auth`: user, tokens, `isAuthenticated`) and `booking.store.ts` (ephemeral, not persisted: in-progress `selectedEvent`/`currentBooking`/`pricing`/`paymentMethod` for the booking wizard, cleared via `reset()`).

**API client** (`src/lib/api.ts`): single axios instance. Request interceptor attaches `Bearer <accessToken>` from localStorage. Response interceptor auto-refreshes on 401 via `/auth/refresh` using the stored refresh token, retries the original request once (`_retry` flag), and hard-redirects to `/login` + clears storage on refresh failure. Auth tokens are read directly from `localStorage`, not from the Zustand store, in this file.

**API response envelope**: the backend wraps responses as `ApiResponse<T> = { success, data, timestamp }` and list endpoints as `PaginatedResponse<T> = { items, meta: { total, page, limit, totalPages } }` (see `src/types/index.ts`). Hooks unwrap `.data.data` from axios responses.

**Domain model** (`src/types/index.ts`): `Event` (category `HIKE|BIKE|PRIVATE|TRAINING`, difficulty `BEGINNER|MODERATE|ADVANCED`, has both `price` and member-discounted `memberPrice`), `Booking` (status/paymentStatus state machines), `Subscription` (membership plans `MONTHLY|QUARTERLY|ANNUAL`), `PricingResult` (computed price/discount for a given user+event, used by `useEventPricing` in the booking flow). Membership status drives pricing — see `MembershipTeaser` component and the `useSubscription` hook.

**Styling**: Tailwind v4 (via `@tailwindcss/postcss`, no `tailwind.config` — CSS-based config in `globals.css`). Dark theme by default (`bg-stone-950 text-stone-100` on `<body>`). `cn()` in `src/lib/utils.ts` (clsx + tailwind-merge) is the standard class-merging helper. `src/lib/utils.ts` also holds shared formatters: `formatKES` (currency), `formatEventDate`/`formatRelative` (date-fns), `difficultyColor`/`categoryIcon` (badge styling per enum value), `getApiErrorMessage` (unwraps axios/NestJS-style error bodies for toasts).

**Path alias**: `@/*` → `src/*`.

## Working in this repo

This project pins `next@16`, `react@19`, and `tailwindcss@4` — all newer than what most training data covers. Per `AGENTS.md`, check `node_modules/next/dist/docs/` before relying on remembered Next.js APIs or conventions, especially around routing, `next/font`, and config shape.
