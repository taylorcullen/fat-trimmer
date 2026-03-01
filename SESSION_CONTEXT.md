# Fat Trimmer - Session Context

## Project Overview
A Next.js 14 weight loss tracking app with Google OAuth authentication.

## Current State
- All code is complete and builds successfully
- PostgreSQL running via `docker-compose.db.yml`
- App runs locally with `npm run dev`
- Google OAuth configured but getting `redirect_uri_mismatch` error

## Issue to Fix
User needs to add this exact redirect URI in Google Cloud Console:
```
http://localhost:3000/api/auth/callback/google
```

Steps:
1. Go to https://console.cloud.google.com/
2. Select project
3. APIs & Services > Credentials
4. Click OAuth 2.0 Client ID
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Save

## How to Run

```bash
# Start database
docker-compose -f docker-compose.db.yml up -d

# Push schema
npm run db:push

# Start app
npm run dev
```

Open http://localhost:3000

## Database Connection (DataGrip)
- Host: localhost
- Port: 5432
- Database: weighttracker
- User: postgres
- Password: postgres

## Key Files
- `.env` - Contains Google OAuth credentials and database URL
- `docker-compose.db.yml` - PostgreSQL only
- `docker-compose.yml` - Full stack (app + db)
- `prisma/schema.prisma` - Database schema

## Tech Stack
- Next.js 14, React 18, TypeScript
- Tailwind CSS (purple/blue dark theme)
- NextAuth.js with Google Provider
- PostgreSQL with Prisma ORM
- Recharts for charts
