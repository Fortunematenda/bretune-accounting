# Bretune Accounting

Professional accounting platform for small businesses — invoices, quotes, statements, multi-currency support, and reporting.

## Stack

- **Frontend**: React 18, Vite, React Router, Tailwind CSS, Recharts
- **Backend**: NestJS, Prisma, PostgreSQL
- **Auth**: JWT (access + refresh tokens)

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

## Quick Start

### 1. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure backend

```bash
cp backend/.env.example backend/.env
# Edit backend/.env: set DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET
```

### 3. Database setup

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed   # Creates initial admin (optional)
```

### 4. Run development

```bash
# From project root — runs backend + frontend
npm run dev
```

- Backend: http://localhost:3000  
- Frontend: http://localhost:3001  
- Swagger (dev only): http://localhost:3000/api  

## Production Deployment

### 1. Configure environment

```bash
# Backend: copy and edit
cp backend/.env.production.example backend/.env
# Set: DATABASE_URL, JWT_SECRET (32+ chars), JWT_REFRESH_SECRET (32+ chars), FRONTEND_URL

# Generate secrets: openssl rand -base64 32
```

### 2. Run deployment (from project root)

```bash
# Full deployment: DB migrations + backend + frontend build
npm run deploy:prepare

# Frontend with API URL (run from root or frontend/)
cd frontend
$env:VITE_API_URL="https://api.yourdomain.com"; npm run build
```

Or use the PowerShell script:
```powershell
.\scripts\deploy.ps1 -ApiUrl "https://api.yourdomain.com"
# Options: -BackendOnly, -FrontendOnly, -SkipDb
```

### 3. Start backend

```bash
cd backend
NODE_ENV=production node dist/main.js
```

**Using PM2** (recommended for production):
```bash
# From project root
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Enable restart on reboot
```

### 4. Serve frontend

Deploy `frontend/dist/` to your host (Nginx, Vercel, Netlify, etc.).

**Nginx**: See `config/nginx.conf.example` for a sample config (includes `client_max_body_size 50M` for uploads).

### Health check endpoints

- `GET /health` — Full health (includes DB check)
- `GET /health/live` — Liveness probe (no DB)

Use `/health/live` for load balancer health checks.

## Environment Variables

### Backend (required)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Min 32 chars — `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | Min 32 chars, different from JWT_SECRET |
| `FRONTEND_URL` | Frontend origin(s), comma-separated |

### Backend (optional)
| Variable | Default |
|----------|---------|
| `PORT` | 3000 |
| `LOG_LEVEL` | `info` (use `warn` in prod) |
| `UPLOAD_PATH` | `./uploads` |
| `MAX_FILE_SIZE` | 5MB |
| `SMTP_*` | Email config for statements/invoices |

### Frontend build
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL (e.g. `https://api.yourdomain.com`) |

## Project Structure

```
├── backend/              # NestJS API
├── frontend/             # React SPA
├── config/               # Nginx example, etc.
├── scripts/              # Deploy scripts
├── ecosystem.config.js   # PM2 config
├── DEPLOYMENT_CHECKLIST.md
└── README.md
```

See **DEPLOYMENT_CHECKLIST.md** for a full pre-deploy checklist.

## License

Private — Bretune Technologies
