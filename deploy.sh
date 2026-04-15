#!/bin/bash
# ============================================================
# deploy.sh - Deployment script for Bagong Jaya Motor
# Run this on your VPS after: git pull
# Usage: bash deploy.sh [all|backend|frontend|admin]
# ============================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err() { echo -e "${RED}[ERROR]${NC} $1"; }

deploy_backend() {
  log "🔧 Building Backend..."
  cd "$PROJECT_DIR/backend"

  if [ ! -f .env ]; then
    err ".env file not found in backend/! Copy from .env.example and fill in values."
    exit 1
  fi

  npm install --production=false
  npm run build
  
  log "📦 Pushing database schema..."
  npm run db:push 2>/dev/null || warn "db:push failed (schema might already be up to date)"

  log "🔄 Restarting backend with PM2..."
  if pm2 describe bagong-api > /dev/null 2>&1; then
    pm2 restart bagong-api
  else
    pm2 start dist/index.js --name "bagong-api"
    pm2 save
  fi

  log "✅ Backend deployed!"
}

deploy_frontend() {
  log "🎨 Building Frontend..."
  cd "$PROJECT_DIR/frontend"

  if [ ! -f .env.production ]; then
    warn ".env.production not found. Creating with default API URL..."
    echo 'VITE_API_BASE_URL=https://api.yourdomain.com/api' > .env.production
    warn "⚠️  Edit frontend/.env.production with your actual API domain!"
  fi

  npm install
  npm run build
  log "✅ Frontend deployed! (Nginx serves from frontend/dist/)"
}

deploy_admin() {
  log "🛡️  Building Admin Dashboard..."
  cd "$PROJECT_DIR/admin"

  if [ ! -f .env.production ]; then
    warn ".env.production not found. Creating with default API URL..."
    echo 'VITE_API_BASE_URL=https://api.yourdomain.com/api' > .env.production
    warn "⚠️  Edit admin/.env.production with your actual API domain!"
  fi

  npm install
  npm run build
  log "✅ Admin deployed! (Nginx serves from admin/dist/)"
}

# ============================================================
# Main
# ============================================================
TARGET=${1:-all}

log "🚀 Deploying Bagong Jaya Motor..."
log "Target: $TARGET"
echo ""

case $TARGET in
  backend)
    deploy_backend
    ;;
  frontend)
    deploy_frontend
    ;;
  admin)
    deploy_admin
    ;;
  all)
    deploy_backend
    echo ""
    deploy_frontend
    echo ""
    deploy_admin
    ;;
  *)
    err "Unknown target: $TARGET"
    echo "Usage: bash deploy.sh [all|backend|frontend|admin]"
    exit 1
    ;;
esac

echo ""
log "🎉 Deployment complete!"
log "Check status: pm2 status"
log "Check logs:   pm2 logs bagong-api"
