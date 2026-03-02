# Fat Trimmer - Weight Loss Tracker

A modern, mobile-first weight loss tracking application built with Next.js 14, PostgreSQL, and Google Authentication.

## Features

- **Google Authentication** - Secure sign-in with your Google account
- **Weight Tracking** - Log daily weight with notes
- **BMI Calculation** - Automatic BMI calculation and categorization
- **Goal Setting** - Set and track progress towards your goal weight
- **Body Measurements** - Track chest, waist, hips, arm, and thigh measurements
- **Progress Photos** - Upload and compare before/after photos (stored in S3/MinIO)
- **Interactive Charts** - Visualize your weight trends over time
- **Mobile-First Design** - Responsive UI optimized for mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom purple/blue theme
- **Authentication**: NextAuth.js with Google Provider
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: MinIO (S3-compatible) for progress photo uploads
- **Charts**: Recharts
- **Deployment**: Docker Compose

## Prerequisites

- Node.js 18+ (for local development)
- Docker and Docker Compose
- Google OAuth credentials (from Google Cloud Console)

## Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd fat-trimmer
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/weighttracker?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# MinIO / S3
S3_ENDPOINT="http://localhost:9000"
S3_BUCKET="fat-trimmer"
S3_ACCESS_KEY="minio"
S3_SECRET_KEY="miniominio"
```

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret to your `.env` file

### 4. Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Running with Docker Compose (Recommended)

Docker Compose starts everything you need — PostgreSQL, MinIO, and the app itself:

```bash
# Build and start all services
docker-compose up -d

# The app will be available at http://localhost:3000
```

This will start:
- **PostgreSQL** on port `5432` — application database
- **MinIO** on port `9000` (API) and `9001` (web console) — S3-compatible photo storage
- **minio-setup** — one-shot container that creates the `fat-trimmer` bucket automatically
- **migrate** — runs `prisma db push` to sync the database schema
- **app** — the Next.js application on port `3000`

### MinIO Web Console

After starting Docker Compose, you can manage stored files via the MinIO console:

1. Open [http://localhost:9001](http://localhost:9001)
2. Log in with the credentials from your `.env` (default: `minio` / `miniominio`)
3. The `fat-trimmer` bucket is created automatically by the `minio-setup` service

## Running Locally (Development)

For local development you still need PostgreSQL and MinIO running. The easiest way is to start just those services with Docker:

### 1. Start PostgreSQL and MinIO

```bash
# Start only the infrastructure services
docker-compose up -d postgres minio minio-setup
```

This gives you:
- PostgreSQL at `localhost:5432`
- MinIO S3 API at `localhost:9000`
- MinIO Console at `localhost:9001`
- The `fat-trimmer` bucket created automatically

### 2. Push the database schema

```bash
npm run db:push
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open [http://localhost:3000](http://localhost:3000)

## S3 / MinIO Configuration

The app uses S3-compatible storage (MinIO) for progress photo uploads. Photos are uploaded server-side and served via presigned URLs.

| Variable | Description | Default |
|----------|-------------|---------|
| `S3_ENDPOINT` | MinIO/S3 API URL | `http://localhost:9000` |
| `S3_BUCKET` | Bucket name for photo storage | `fat-trimmer` |
| `S3_ACCESS_KEY` | MinIO root user / S3 access key | `admin` |
| `S3_SECRET_KEY` | MinIO root password / S3 secret key | `Password001!` |
| `S3_REGION` | S3 region (only needed for AWS S3) | `us-east-1` |

### Using AWS S3 instead of MinIO

To use real AWS S3 instead of MinIO, update your `.env`:

```env
S3_ENDPOINT=""
S3_BUCKET="your-s3-bucket-name"
S3_ACCESS_KEY="your-aws-access-key-id"
S3_SECRET_KEY="your-aws-secret-access-key"
S3_REGION="eu-west-1"
```

Remove or leave `S3_ENDPOINT` empty — the AWS SDK will use the default S3 endpoint for your region.

## Accessing on Mobile with ngrok

[ngrok](https://ngrok.com/) creates a public HTTPS tunnel to your local dev server, letting you access the app from your phone (or anywhere). This is useful for testing the mobile-first UI on a real device.

### 1. Install ngrok

Download from [ngrok.com/download](https://ngrok.com/download) or install via a package manager:

```bash
# macOS
brew install ngrok

# Windows (chocolatey)
choco install ngrok

# Or download the binary and add it to your PATH
```

Sign up for a free account and authenticate:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 2. Start the tunnel

With your dev server running on port 3000:

```bash
ngrok http 3000
```

ngrok will display a forwarding URL like:

```
Forwarding  https://abc123-random-words.ngrok-free.app -> http://localhost:3000
```

For a stable URL (free plan allows one static domain), you can reserve a domain in the ngrok dashboard and use:

```bash
ngrok http --url=your-static-domain.ngrok-free.app 3000
```

### 3. Update Google OAuth credentials

Google OAuth will reject requests from the ngrok URL unless you add it as an authorised origin and redirect. Go to [Google Cloud Console](https://console.cloud.google.com/) > "APIs & Services" > "Credentials" > your OAuth client, and add:

- **Authorised JavaScript origins:**
  - `https://your-static-domain.ngrok-free.app`
- **Authorised redirect URIs:**
  - `https://your-static-domain.ngrok-free.app/api/auth/callback/google`

Keep your existing `http://localhost:3000` entries so local development still works — you can have multiple origins and redirect URIs on the same OAuth client.

### 4. Update NEXTAUTH_URL

Set `NEXTAUTH_URL` in your `.env` to the ngrok URL:

```env
NEXTAUTH_URL="https://your-static-domain.ngrok-free.app"
```

Then restart the dev server so NextAuth picks up the new URL:

```bash
npm run dev
```

### 5. Open on your phone

Navigate to your ngrok URL on your mobile browser. Google sign-in will work as normal since the ngrok domain is now authorised in your OAuth credentials.

> **Tip:** Remember to switch `NEXTAUTH_URL` back to `http://localhost:3000` when you're done testing on mobile.

## Project Structure

```
fat-trimmer/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard page
│   │   ├── goals/         # Goals page
│   │   ├── history/       # Weight history page
│   │   ├── log/           # Log weight page
│   │   ├── login/         # Login page
│   │   ├── measurements/  # Body measurements page
│   │   ├── photos/        # Progress photos page
│   │   └── settings/      # User settings page
│   ├── components/        # Reusable components
│   │   ├── charts/        # Chart components
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # UI primitives
│   ├── lib/               # Utilities and config
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── prisma.ts      # Prisma client singleton
│   │   ├── s3.ts          # S3/MinIO client and helpers
│   │   ├── units.ts       # Metric/imperial conversions
│   │   ├── unit-context.tsx # Unit system React Context
│   │   └── utils.ts       # BMI, formatting utilities
│   └── types/             # TypeScript types
├── scripts/
│   └── migrate-goals.ts   # Goal data migration script
├── docker-compose.yml     # Docker Compose (app + postgres + minio)
├── Dockerfile             # Multi-stage Docker build
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | Base URL of your app |
| `NEXTAUTH_SECRET` | Secret for JWT encryption |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `S3_ENDPOINT` | MinIO/S3 endpoint URL |
| `S3_BUCKET` | S3 bucket name for photos |
| `S3_ACCESS_KEY` | S3 access key |
| `S3_SECRET_KEY` | S3 secret key |
| `S3_REGION` | S3 region (AWS only) |

## License

MIT
