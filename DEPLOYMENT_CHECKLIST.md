# Pre-Deployment Checklist

This document lists improvements and checks recommended before deploying Bretune Accounting to production.

**Implemented:** Health endpoint, Helmet, CORS multi-origin, Swagger disabled in prod, Error boundary, Favicon, Vite build config, uploads in .gitignore, production env examples, deployment scripts (npm run deploy:prepare, scripts/deploy.ps1), logo in frontend/public, PM2 ecosystem config (ecosystem.config.js), Nginx example (config/nginx.conf.example), README with env reference and deployment steps.

---

## 1. Security

### 1.1 Environment & Secrets
- [ ] **JWT secrets**: Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are strong (min 32 chars in production) and unique—never use example values
- [ ] **Database**: Use a production PostgreSQL instance; never expose `DATABASE_URL` (already in `.gitignore`)
- [ ] **`.env`**: Confirm `.env` is in `.gitignore` and never committed (already configured)
- [ ] **Production env**: Create `.env.production` or use your hosting platform’s secret management

### 1.2 CORS
- [ ] **CORS origin**: In production, set `FRONTEND_URL` to your real frontend URL (e.g. `https://app.yourdomain.com`)
- [ ] **Multiple origins**: If you need multiple frontend origins, update `main.js` CORS config to accept an array:
  ```js
  origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:3001'],
  ```

### 1.3 Swagger / API Docs
- [ ] **Disable Swagger in production** or restrict access (e.g. IP allowlist, auth):
  ```js
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api', app, document);
  }
  ```

### 1.4 Security Headers
- [ ] **Helmet**: Add `helmet` for standard security headers (e.g. X-Content-Type-Options, X-Frame-Options)
- [ ] **HTTPS**: Ensure the app is served over HTTPS in production

### 1.5 Rate Limiting
- [ ] Consider tightening `THROTTLE_LIMIT` and `THROTTLE_TTL_SECONDS` in production
- [ ] Current defaults: 100 requests per 60 seconds

---

## 2. Frontend

### 2.1 Build Configuration
- [ ] **API URL**: For production builds, set `VITE_API_URL` to your API (e.g. `https://api.yourdomain.com`)
- [ ] **Build**: Run `npm run build` in `frontend/` and verify the output
- [ ] **Base path**: If the app will run at a subpath (e.g. `/app`), set `base` in `vite.config.js`

### 2.2 Favicon & Branding
- [ ] **Favicon**: Replace `/vite.svg` with a real favicon (e.g. Bretune logo) in `index.html`
- [ ] **Title**: Update `<title>` if needed (currently "Bretune Accounting")

### 2.3 Error Handling
- [ ] Add a global error boundary for uncaught React errors
- [ ] Ensure 401/403 responses trigger logout or redirect to login

---

## 3. Backend

### 3.1 Database
- [ ] **Migrations**: Run `npm run prisma:deploy` in `backend/` before starting
- [ ] **Seeding**: Decide if seed data is required and run `npm run prisma:seed` if needed
- [ ] **Connections**: Check pool/connection limits for production DB

### 3.2 File Storage
- [ ] **Uploads**: Add `uploads/` to `.gitignore` if it is not already
- [ ] **Storage**: For multi-instance deploys, use object storage (S3, etc.) instead of local `UPLOAD_PATH`

### 3.3 Logging
- [ ] **LOG_LEVEL**: Set to `warn` or `error` in production
- [ ] **LOG_FILE**: Ensure the log directory exists and is writable
- [ ] **Console**: Reduce or remove `console.log` in production paths

### 3.4 Health Check
- [ ] Add a `/health` or `/api/health` endpoint for load balancers and monitoring
- [ ] Include DB connectivity checks if useful

---

## 4. Infrastructure & DevOps

### 4.1 Process Manager
- [x] **PM2 config**: `ecosystem.config.js` + `npm run pm2:start` (run from project root)
- [ ] Configure `pm2 startup` for restart on reboot

### 4.2 Reverse Proxy
- [ ] Use Nginx, Caddy, or similar to proxy requests to the backend
- [ ] Serve static frontend assets from the same domain or a CDN
- [ ] Set correct headers (e.g. X-Forwarded-For, X-Forwarded-Proto) for HTTPS
- [x] **File uploads**: See `config/nginx.conf.example` — includes `client_max_body_size 50M` for PDF/statement uploads

### 4.3 Environment Variables
- [ ] **Required for production**:
  - `NODE_ENV=production`
  - `DATABASE_URL`
  - `JWT_SECRET` (min 32 chars)
  - `JWT_REFRESH_SECRET` (min 32 chars)
  - `FRONTEND_URL` (production frontend URL)
- [ ] **Optional**: SMTP, `MAX_FILE_SIZE`, `UPLOAD_PATH`, `LOG_LEVEL`, `BODY_LIMIT` (default 50mb for file uploads)

---

## 5. Code Quality

### 5.1 Linting
- [ ] Run `npm run lint` in both `frontend/` and `backend/`
- [ ] Fix or resolve lint issues before deploying

### 5.2 Unused Code
- [ ] Review unused exports, dead code, and commented-out blocks
- [ ] Example: `initialsFrom` in `pdf-generator.js` is defined but unused

### 5.3 Dependencies
- [ ] Run `npm audit` in root, `frontend/`, and `backend/`
- [ ] Update vulnerable packages where possible

---

## 6. Documentation

### 6.1 README
- [x] Root `README.md` includes: overview, prerequisites, dev setup, production deployment, env var reference
- [ ] Document deployment steps for your specific hosting platform (if different from generic)

### 6.2 API Documentation
- [ ] If Swagger is enabled in production, document how it is accessed
- [ ] Note any authentication requirements for docs

---

## 7. Testing

### 7.1 Manual Testing
- [ ] Test core flows: login, invoices, payments, reports
- [ ] Test password reset if implemented
- [ ] Test PDF generation (invoices, statements)
- [ ] Test currency converter and exchange rates

### 7.2 Automated Tests
- [ ] Add basic unit tests for critical logic (if not present)
- [ ] Run tests in CI before deploy

---

## 8. Post-Deploy

- [ ] **Monitoring**: Set up error tracking (e.g. Sentry) for backend and frontend
- [ ] **Backups**: Configure database backups
- [ ] **SSL**: Confirm SSL certificates are valid and auto-renewed
- [ ] **Domain**: Point DNS to the correct servers

---

## Quick Commands Reference

```bash
# Build frontend for production
cd frontend && VITE_API_URL=https://api.yourdomain.com npm run build

# Backend migrations
cd backend && npm run prisma:deploy

# Start backend (production)
cd backend && NODE_ENV=production node dist/main.js
```

---

*Generated from project scan. Customize as needed for your deployment environment.*
