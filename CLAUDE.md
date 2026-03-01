# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Summary

Fat Trimmer is a weight loss tracking app built with Next.js 14 (App Router), PostgreSQL, and Google OAuth. Users can track weight, body measurements, progress photos, and goals with interactive charts.

## Common Commands

```bash
# Development
npm run dev              # Start dev server (0.0.0.0:3000)
npm run build            # Generate Prisma client + Next.js build
npm run start            # Production server
npm run lint             # ESLint (next/core-web-vitals)

# Database
npm run db:push          # Sync Prisma schema to database
npm run db:studio        # Open Prisma Studio GUI
npm run db:generate      # Generate Prisma client

# Docker (full stack)
docker-compose up -d     # App + PostgreSQL + auto-migration
```

**Local dev setup:** Start PostgreSQL via Docker, run `npm run db:push`, then `npm run dev`.

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router, React 18, TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom purple/blue dark theme
- **Auth**: NextAuth.js with Google OAuth provider + Prisma adapter
- **Database**: PostgreSQL via Prisma ORM
- **Storage**: AWS S3/MinIO for photo uploads (presigned URLs)
- **Charts**: Recharts

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig.json).

### Data Flow Pattern
- **Pages** are server components that fetch initial data and compute stats (BMI, progress)
- **Client components** (marked `"use client"`) handle interactivity and call API routes for mutations
- **Unit system** (metric/imperial) is managed via React Context (`UnitProvider`), stored in the user's DB record, and applied at display time — all data is stored in metric

### API Routes (`src/app/api/`)
RESTful endpoints at `/api/weights`, `/api/measurements`, `/api/photos`, `/api/user`. All routes verify session ownership via `getServerSession()` before any CRUD operation. Pagination via `limit`/`offset` query params.

### Key Modules (`src/lib/`)
- `auth.ts` — NextAuth configuration with Google provider and Prisma adapter
- `prisma.ts` — Singleton Prisma client (avoids multiple instances in dev)
- `s3.ts` — S3 client configuration and upload/delete helpers
- `units.ts` — Metric/imperial conversion functions
- `unit-context.tsx` — React Context provider for unit system preference
- `utils.ts` — BMI calculation, date/number formatting

### Database Schema (`prisma/schema.prisma`)
Core models: `User`, `Weight`, `Measurement`, `Photo`. Auth models: `Account`, `Session`, `VerificationToken`. All tracking models reference `userId` with cascade delete. Weight and Measurement tables are indexed on `userId + date`.

### UI Components (`src/components/`)
- `ui/` — Primitives (Button, Card, Input, Modal) with variant props (primary/secondary/ghost/danger)
- `layout/` — AppLayout wrapper with sidebar nav (desktop) and bottom nav (mobile)
- `charts/` — Recharts-based weight trend visualization
- `forms/` — Weight entry form with metric/imperial toggle

### Docker
Multi-stage Dockerfile (node:20-alpine) with standalone output. docker-compose.yml runs a `migrate` service (`prisma db push`) before starting the app.
