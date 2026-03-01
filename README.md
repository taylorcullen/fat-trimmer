# Fat Trimmer - Weight Loss Tracker

A modern, mobile-first weight loss tracking application built with Next.js 14, PostgreSQL, and Google Authentication.

## Features

- **Google Authentication** - Secure sign-in with your Google account
- **Weight Tracking** - Log daily weight with notes
- **BMI Calculation** - Automatic BMI calculation and categorization
- **Goal Setting** - Set and track progress towards your goal weight
- **Body Measurements** - Track chest, waist, hips, arm, and thigh measurements
- **Progress Photos** - Upload and compare before/after photos
- **Interactive Charts** - Visualize your weight trends over time
- **Mobile-First Design** - Responsive UI optimized for mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom purple/blue theme
- **Authentication**: NextAuth.js with Google Provider
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts
- **Deployment**: Docker Compose

## Prerequisites

- Node.js 18+ (for local development)
- Docker and Docker Compose (for containerized deployment)
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
DATABASE_URL="postgresql://user:password@localhost:5432/weighttracker?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
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

```bash
# Build and start all services
docker-compose up -d

# The app will be available at http://localhost:3000
```

This will start:
- The Next.js application on port 3000
- PostgreSQL database on port 5432
- Automatic database migrations

## Running Locally (Development)

1. Start a PostgreSQL database (or use Docker):
```bash
docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=weighttracker -p 5432:5432 postgres:15-alpine
```

2. Push the database schema:
```bash
npm run db:push
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

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
│   └── types/             # TypeScript types
├── public/
│   └── uploads/           # User uploaded photos
├── docker-compose.yml     # Docker Compose config
├── Dockerfile             # Docker build config
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

## License

MIT
