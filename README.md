# JUSTIQ-AI

AI-Powered District Court Judgment Summarization & Legal Case Management Platform.

JUSTIQ is a specialized platform tailored for District Court practitioners, advocates, and judicial chambers. Users can upload district court orders and judgments, extract facts and ratio decidendi, track trial hearings and cause lists, discover relevant district precedents, and manage active civil and criminal dockets efficiently.

---

## Architecture Overview

The repository maintains strict separation between the frontend and backend applications:

- **Frontend**: React + Vite + JavaScript + Tailwind CSS v4 (`frontend/`)
- **Backend**: Next.js + JavaScript (App Router) (`backend/`)

---

## Directory Structure

```text
JUSTIQ-AI/
├── .gitignore               # Root gitignore rules
├── package.json             # Root scripts for running/building both applications
├── README.md                # Project documentation and setup guide
│
├── frontend/                # React + Vite application
│   ├── .env.example         # Frontend environment variable template
│   ├── .gitignore           # Frontend-specific gitignore rules
│   ├── vite.config.js       # Vite configuration with @tailwindcss/vite
│   ├── src/
│   │   ├── assets/          # Static assets (images, icons, etc.)
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page and route-level components
│   │   ├── layouts/         # Layout components (Header, Sidebar, Shell)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React context providers and global state
│   │   ├── services/        # API client and network services
│   │   ├── utils/           # Helper functions and utilities
│   │   ├── App.jsx          # Root component
│   │   ├── index.css        # Tailwind CSS v4 entry point (@import "tailwindcss";)
│   │   └── main.jsx         # Application entry point
│   └── package.json
│
└── backend/                 # Next.js App Router application
    ├── .env.example         # Backend environment variable template
    ├── .gitignore           # Backend-specific gitignore rules
    ├── next.config.mjs      # Next.js configuration
    ├── jsconfig.json        # Path alias mapping (@/* -> ./src/*)
    ├── src/
    │   ├── app/             # Next.js App Router routes & layouts
    │   │   └── api/         # Backend API routes (e.g., /api/health)
    │   ├── lib/             # Third-party wrappers and shared libraries
    │   ├── services/        # Business logic & AI summarization services
    │   ├── models/          # Data schemas and models
    │   ├── utils/           # Server utilities and helper functions
    │   └── config/          # Environment and application constants
    └── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18.x or v20.x+ recommended)
- **npm** (v9+ recommended)

### 1. Installation

You can install dependencies for both applications from the root directory:

```bash
npm run install:all
```

Or install them individually:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Environment Configuration

Copy the example environment files in both projects and populate the values:

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

#### Frontend Variables (`frontend/.env.example`):
- `VITE_API_BASE_URL`: Base URL for the backend API (e.g., `http://localhost:3000/api`).
- `VITE_APP_ENV`: Application environment (`development` | `production`).

#### Backend Variables (`backend/.env.example`):
- `NODE_ENV`: Runtime environment.
- `PORT`: Server port (default: `3000`).
- `ALLOWED_ORIGINS`: Allowed CORS origins for the frontend (e.g., `http://localhost:5173`).
- `DATABASE_URL`: Database connection string.
- `JWT_SECRET`: Secret key for authentication tokens.
- `AI_API_KEY`: API key for legal summarization LLM provider.

---

## Development

Run development servers concurrently or individually:

```bash
# Frontend only (starts Vite dev server at http://localhost:5173)
npm run dev:frontend

# Backend only (starts Next.js server at http://localhost:3000)
npm run dev:backend
```

---

## Building and Linting

```bash
# Build both frontend and backend
npm run build

# Build individually
npm run build:frontend
npm run build:backend

# Lint both frontend and backend
npm run lint
```

---

## API Health Check

Once the backend is running, verify API readiness:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "JUSTIQ Backend API",
  "version": "1.0.0",
  "timestamp": "..."
}
```
