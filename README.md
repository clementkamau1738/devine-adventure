# Devine Adventure

Kenya outdoor adventure booking platform — NestJS API + Next.js web + Postgres.

| Path | Stack |
|------|--------|
| `devine-adventure-api/` | NestJS 11, Prisma, JWT, M-Pesa / Stripe hooks |
| `devine-adventure-web/` | Next.js 16, React 19, Tailwind v4 |

## Local development

```bash
# API + Postgres (Docker on host port 5434 in this workspace)
cd devine-adventure-api
cp .env.example .env   # set DATABASE_URL + DIRECT_URL
npm install
npx prisma migrate deploy
npx prisma db seed
npm run start:dev      # :3001

# Web
cd ../devine-adventure-web
cp .env.example .env.local
npm install
npm run dev            # :3000
```

## Production deploy (Render + Supabase)

See **[DEPLOY.md](./DEPLOY.md)** for the full checklist.

- Blueprint: [`render.yaml`](./render.yaml)
- Prod DB: **Supabase Postgres** (`DATABASE_URL` pooler + `DIRECT_URL` direct)
- Hosting: **Render** web services for API and frontend
