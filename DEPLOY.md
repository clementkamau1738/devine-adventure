# Deploy Devine Adventure — Render Free + Supabase Free

This guide is for the **free tier** only:

| Piece | Free host |
|-------|-----------|
| Web (Next.js) | **Render Static Site** (`output: 'export'`) — no sleep |
| API (NestJS) | Render free Web Service — sleeps after ~15 min idle |
| Postgres | Supabase free project |

Frontend is static HTML/JS talking to the API. You do **not** need a Node server for the web app.

Repo: https://github.com/clementkamau1738/devine-adventure  
Blueprint: `render.yaml` (`plan: free` for both services)

### Free-tier limits (expect these)

- **API only** sleeps after ~15 minutes idle (first API call can take 30–60s)
- **Static web** stays up (CDN) — page shell loads fast; data waits on API wake-up
- Build minutes are limited per month on free accounts
- New event detail URLs are snapshotted at web **build** time — redeploy web after adding many new trips (listing still works via API)

---

## Step 1 — Supabase free database

1. Go to https://supabase.com → **Start your project** (free).
2. Create an organization if needed, then a project (set a strong DB password; save it).
3. Wait until the project status is **Healthy**.
4. Open **Project Settings** (gear) → **Database**.
5. Under **Connection string**, switch to **URI**.

### Copy two strings

**A. `DATABASE_URL` (for the running API)**  
Connection pooling → **Transaction** mode → port **6543**:

```text
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**B. `DIRECT_URL` (for Prisma migrations)**  
Use **Session** pooler port **5432**, or **Direct connection**:

```text
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

or:

```text
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Replace `[YOUR-PASSWORD]` with the password you set (URL-encode special characters like `@` → `%40`).

---

## Step 2 — Confirm GitHub is up to date

Code is on:

```text
https://github.com/clementkamau1738/devine-adventure
branch: main
```

You need the latest `main` (includes free-tier `render.yaml`).

---

## Step 3 — Create services on Render (Blueprint)

1. Go to https://dashboard.render.com and sign in (free account is fine).
2. Click **New +** → **Blueprint**.
3. Connect GitHub if prompted; select **`clementkamau1738/devine-adventure`**.
4. Branch: **`main`**.
5. Render will detect `render.yaml` and show:
   - `devine-adventure-api` (Web Service, free)
   - `devine-adventure-web` (Static Site)

### Fill env vars before you click Apply

Render marks some vars as “from Blueprint / sync: false” — you must paste values.

#### API service (`devine-adventure-api`)

| Key | What to paste |
|-----|----------------|
| `DATABASE_URL` | Supabase **pooler :6543** string (with `pgbouncer=true`) |
| `DIRECT_URL` | Supabase **direct/session :5432** string |
| `FRONTEND_URL` | `https://devine-adventure-web.onrender.com` |
| `APP_URL` | `https://devine-adventure-api.onrender.com` |
| `JWT_ACCESS_SECRET` | Leave as auto-generated |
| `JWT_REFRESH_SECRET` | Leave as auto-generated |
| M-Pesa / Stripe / Mailchimp | Leave empty for now |

#### Web service (`devine-adventure-web`)

| Key | What to paste |
|-----|----------------|
| `NEXT_PUBLIC_API_URL` | `https://devine-adventure-api.onrender.com/api/v1` |

> If Render shows a different hostname after create (unique suffix), update these URLs to match.

6. Click **Apply**.
7. Wait for both services to finish building (5–15 min on free tier). Status should become **Live** (or **Available**).

---

## Step 4 — Manual create (if Blueprint is awkward)

Use this if you prefer **New → Web Service** twice.

### 4a. API service

1. **New +** → **Web Service** → pick the repo.
2. Settings:

| Field | Value |
|-------|--------|
| Name | `devine-adventure-api` |
| Region | Oregon (or closest) |
| Root Directory | `devine-adventure-api` |
| Runtime | Node |
| Build Command | `npm ci && npm run build` |
| Start Command | `npx prisma migrate deploy && npm run start:prod` |
| Instance type | **Free** |
| Health Check Path | `/api/v1/health` |

3. Environment variables (same table as Step 3 API).
4. **Create Web Service**.

### 4b. Web static site (recommended on free tier)

1. **New +** → **Static Site** → same repo.
2. Settings:

| Field | Value |
|-------|--------|
| Name | `devine-adventure-web` |
| Root Directory | `devine-adventure-web` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `out` |

3. Env: `NEXT_PUBLIC_API_URL` = `https://devine-adventure-api.onrender.com/api/v1`  
   (use your real API URL if different — must be set **before** build)
4. **Create Static Site**.

> Deploy **API first**, wait until it is Live, then build the static site so `generateStaticParams` can read events from the API.

---

## Step 5 — Fix URLs after first live deploy

1. Open each service → copy the public URL from the top of the page.
2. API → **Environment**:
   - `FRONTEND_URL` = exact web URL (no trailing slash)
   - `APP_URL` = exact API URL
3. Web → **Environment**:
   - `NEXT_PUBLIC_API_URL` = `https://<api-host>/api/v1`
4. Web → **Manual Deploy** → **Clear build cache & deploy**  
   (required so Next bakes the public API URL into the client).
5. API → **Manual Deploy** → **Deploy latest commit** if you changed `FRONTEND_URL`.

---

## Step 6 — Seed demo data (Shell)

1. Open **devine-adventure-api** on Render.
2. Click **Shell** (wait if the free instance is waking up).
3. Run:

```bash
npx prisma db seed
```

Demo logins:

- Admin: `admin@devineadventure.co.ke` / `Admin@2025!`
- Member: `member@devineadventure.co.ke` / `Member@2025!`

Change these after testing.

---

## Step 7 — Smoke test

```bash
# Wait 30–60s if free services were asleep
curl https://devine-adventure-api.onrender.com/api/v1/health

curl "https://devine-adventure-api.onrender.com/api/v1/events?limit=3"
```

Then open in the browser:

- `https://devine-adventure-web.onrender.com/`
- `.../membership` (should stay public, no login bounce)
- `.../events/calendar`

---

## Free-tier troubleshooting

| Problem | What to do |
|---------|------------|
| Deploy stuck / build failed | Open **Logs** → look for `npm` / Prisma errors; free builds can time out — redeploy once |
| `P1001` / can't reach DB | Wrong password, or used pooler string for `DIRECT_URL` / vice versa |
| `prepared statement` / pgbouncer errors | `DATABASE_URL` must include `?pgbouncer=true` |
| Site loads, no events | Run seed in API Shell (Step 6) |
| Browser CORS error | `FRONTEND_URL` must match the web origin exactly (`https://...` no slash) |
| Web still hits localhost | Rebuild web after setting `NEXT_PUBLIC_API_URL` |
| “Spinning” forever on first open | Normal free cold start — wait up to 1 minute |
| 502 on API | Check API logs; migrate may have failed — fix `DIRECT_URL` and redeploy |

---

## Optional later upgrades

- Render **Starter** (~$7/service): no sleep, faster
- Supabase Pro: larger DB / backups
- Custom domain on both services when you leave free demos behind
