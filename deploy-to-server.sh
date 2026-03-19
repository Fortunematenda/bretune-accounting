#!/bin/bash
# Bretune-Accounting Deployment Script
# Run this on your server: ssh root@161.97.120.107

set -e

BRETUNE_DIR="/root/Bretune-Accounting"
BRETUNE_PORT=5000

echo "=== Bretune-Accounting Deployment ==="
echo "Port: $BRETUNE_PORT"
echo ""

# 1. Clone or update repository
echo "[1/7] Setting up repository..."
if [ -d "$BRETUNE_DIR" ]; then
    echo "Directory exists, updating..."
    cd "$BRETUNE_DIR"
    git reset --hard
    git clean -fd
    git pull origin main
else
    echo "Cloning repository..."
    git clone <YOUR_REPO_URL> "$BRETUNE_DIR"
    cd "$BRETUNE_DIR"
fi

# 2. Install dependencies
echo "[2/7] Installing dependencies..."
cd "$BRETUNE_DIR/backend"
npm install

# 3. Setup environment
echo "[3/7] Setting up environment..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
NODE_ENV=production
PORT=$BRETUNE_PORT
DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/bretune_accounting?schema=public"
JWT_SECRET=$(openssl rand -base64 32)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://161.97.120.107:3002
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EOF
    echo "Created .env file - PLEASE EDIT IT WITH YOUR ACTUAL VALUES"
else
    echo ".env already exists"
fi

# 4. Setup Database
echo "[4/7] Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE bretune_accounting;" 2>/dev/null || echo "Database already exists"
npx prisma generate
npx prisma migrate deploy

# 5. Build application
echo "[5/7] Building application..."
npm run build

# 6. Setup PM2
echo "[6/7] Setting up PM2..."
cd "$BRETUNE_DIR"
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'bretune-api',
      script: 'dist/main.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: $BRETUNE_PORT,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: $BRETUNE_PORT,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
EOF

# Create logs directory
mkdir -p "$BRETUNE_DIR/backend/logs"

# 7. Start with PM2
echo "[7/7] Starting application..."
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

# Setup firewall
ufw allow $BRETUNE_PORT/tcp 2>/dev/null || echo "UFW not active or rule already exists"

echo ""
echo "=== Deployment Complete ==="
echo "API running on: http://161.97.120.107:$BRETUNE_PORT"
echo ""
echo "Useful commands:"
echo "  pm2 status                    - Check status"
echo "  pm2 logs bretune-api          - View logs"
echo "  pm2 restart bretune-api       - Restart"
echo "  pm2 stop bretune-api          - Stop"
echo ""
echo "Don't forget to:"
echo "  1. Edit backend/.env with your actual values"
echo "  2. Setup your database credentials"
echo "  3. Configure Stripe keys"
echo "  4. Add your email credentials"
