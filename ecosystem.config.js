/**
 * PM2 Ecosystem Config - Production
 * Install: npm install -g pm2
 * Start: pm2 start ecosystem.config.js
 * Stop: pm2 stop bretune-api
 * Logs: pm2 logs bretune-api
 * Status: pm2 status
 */
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
      },
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
