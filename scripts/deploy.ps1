# Bretune Accounting - Deployment Script (PowerShell)
# Run from project root: .\scripts\deploy.ps1
# Prerequisites: Set env vars (DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, FRONTEND_URL)
# For frontend build: Set VITE_API_URL to your API URL

param(
    [string]$ApiUrl = "",
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [switch]$SkipDb
)

$ErrorActionPreference = "Stop"

Write-Host "`n=== Bretune Accounting Deployment ===" -ForegroundColor Cyan

# Backend
if (-not $FrontendOnly) {
    Write-Host "`n[1/4] Backend: Generating Prisma client..." -ForegroundColor Yellow
    Set-Location backend
    npm run prisma:generate
    if (-not $SkipDb) {
        Write-Host "[2/4] Backend: Running database migrations..." -ForegroundColor Yellow
        npm run prisma:deploy
    }
    Write-Host "[3/4] Backend: Building..." -ForegroundColor Yellow
    npm run build
    Set-Location ..
    Write-Host "Backend build complete. Output: backend/dist/" -ForegroundColor Green
}

# Frontend
if (-not $BackendOnly) {
    Write-Host "`n[4/4] Frontend: Building..." -ForegroundColor Yellow
    if ($ApiUrl) {
        $env:VITE_API_URL = $ApiUrl
        Write-Host "  Using VITE_API_URL=$ApiUrl" -ForegroundColor Gray
    } else {
        Write-Host "  Tip: Pass -ApiUrl 'https://api.yourdomain.com' to set API URL" -ForegroundColor Gray
    }
    Set-Location frontend
    npm run build
    Set-Location ..
    Write-Host "Frontend build complete. Output: frontend/dist/" -ForegroundColor Green
}

Write-Host "`n=== Deployment build complete ===" -ForegroundColor Cyan
Write-Host "  Backend:  cd backend && NODE_ENV=production node dist/main.js" -ForegroundColor Gray
Write-Host "  Frontend: Serve the frontend/dist/ folder (Nginx, Vercel, etc.)" -ForegroundColor Gray
Write-Host ""
