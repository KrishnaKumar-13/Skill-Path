# Skill Navigator

A gamified coding skill learning platform built with React + Supabase Cloud + Spring Boot.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                 React Frontend                  │
│           (Vite + TypeScript + Tailwind)        │
│                                                 │
│  • Authentication via @supabase/supabase-js     │
│  • Direct Supabase queries (profiles, XP, etc) │
│  • API calls to Spring Boot (future features)  │
└─────────────┬───────────────────────┬───────────┘
              │ Supabase JS Client    │ Axios
              │ (auth + DB direct)    │ (Spring Boot API)
              ▼                       ▼
┌─────────────────────┐  ┌─────────────────────────┐
│   Supabase Cloud    │  │  Spring Boot Backend     │
│                     │  │  (localhost:8080)         │
│  • Auth (JWT)       │  │                          │
│  • PostgreSQL DB    │◄─┤  • REST API              │
│  • Row Level Sec.   │  │  • Supabase JWT verify   │
│  • RPC functions    │  │  • Business logic        │
└─────────────────────┘  └─────────────────────────┘
```

## Project Structure

```
skill-navigator/
├── src/                          # React Frontend
│   ├── components/               # UI components
│   ├── pages/                    # Route pages
│   ├── contexts/AuthContext.tsx  # Supabase auth state
│   ├── lib/api.ts                # Supabase API calls
│   └── integrations/supabase/   # Supabase client
│
├── backend/                      # Spring Boot API
│   ├── src/main/java/com/skillpath/
│   │   ├── config/               # Security, CORS, JWT filter
│   │   ├── controller/           # REST controllers
│   │   ├── service/              # Business logic
│   │   ├── repository/           # JPA repositories
│   │   ├── entity/               # JPA entities (maps to Supabase DB)
│   │   └── dto/                  # Request/Response objects
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── docs/                         # Reference documents
│   ├── FULL_SETUP.sql            # ← Paste this into Supabase SQL Editor
│   └── BACKEND_README.md         # Spring Boot setup guide
│
├── public/                       # Static assets
├── .env                          # Frontend Supabase credentials
└── package.json
```

## Quick Start

### Step 1: Set up Supabase Database

1. Go to [supabase.com](https://supabase.com) → your project
2. Open **SQL Editor**
3. Paste the entire contents of `docs/FULL_SETUP.sql` and click **Run**

### Step 2: Run the Frontend

```bash
npm install
npm run dev
# Visit http://localhost:5173
```

### Step 3: Run the Backend (Optional)

First, get your database password from Supabase → Settings → Database.

```bash
cd backend

# Set environment variables
$env:SUPABASE_DB_URL="jdbc:postgresql://db.pgnvqldaunqausapobjx.supabase.co:5432/postgres?sslmode=require"
$env:SUPABASE_DB_USER="postgres"
$env:SUPABASE_DB_PASSWORD="your-password-here"
$env:SUPABASE_JWT_SECRET="your-jwt-secret-here"

# Run
mvn spring-boot:run
# Runs at http://localhost:8080
```

## Environment Variables

### Frontend (`.env`)

```env
VITE_SUPABASE_URL=https://pgnvqldaunqausapobjx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...   # Anon key — safe to expose
```

> ✅ The Supabase Anon key is safe in the frontend. Row Level Security (RLS) policies
> ensure each user can only access their own data.

### Backend (environment variables — never commit)

```env
SUPABASE_DB_URL=jdbc:postgresql://db.YOURPROJECT.supabase.co:5432/postgres?sslmode=require
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-db-password   # ← Supabase Settings → Database
SUPABASE_JWT_SECRET=your-jwt-secret     # ← Supabase Settings → API → JWT Secret
```

> ⛔ Never put `SUPABASE_DB_PASSWORD` or `SUPABASE_JWT_SECRET` in the frontend.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| UI | Tailwind CSS + shadcn/ui + Framer Motion |
| Auth | Supabase Auth (JWT) |
| Database | Supabase Cloud (PostgreSQL) |
| API | Spring Boot 3.3 + Spring Data JPA |
| Security | Supabase JWT verification in Spring Boot |

## API Endpoints (Spring Boot)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Health check |
| GET | `/api/questions` | Public | All questions |
| GET | `/api/questions/{language}` | Public | Questions by language |
| GET | `/api/daily-task` | Public | Random daily task |
| GET | `/api/profile` | 🔐 JWT | Your profile |
| POST | `/api/progress/complete` | 🔐 JWT | Mark task complete |
| GET | `/api/progress` | 🔐 JWT | Your progress |
