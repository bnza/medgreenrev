#!/bin/bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────
# MEDGREENREV — Production Deployment Script
# Based on: docs/dev/docker-deployement.md, server-setup.md,
#           client-development.md
# ──────────────────────────────────────────────────────────────

# ── Parse flags ──────────────────────────────────────────────
NO_INTERACTION=false
for arg in "$@"; do
  case "$arg" in
    --no-interaction|-y) NO_INTERACTION=true ;;
  esac
done

# Helper: ask for confirmation unless --no-interaction/-y
confirm() {
  local msg="$1"
  if [ "$NO_INTERACTION" = true ]; then
    return 0
  fi
  read -rp "$msg [Y/n] " answer
  case "${answer:-Y}" in
    [Yy]*) return 0 ;;
    *) return 1 ;;
  esac
}

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Source .env for USER_UID/USER_GID defaults
if [ -f .env ]; then
  # shellcheck disable=SC2046
  export $(grep -v '^#' .env | xargs)
fi

USER_UID="${USER_UID:-1000}"
USER_GID="${USER_GID:-1000}"
APP_ENV="${APP_ENV:-dev}"
POSTGRES_DATA_DIR="${POSTGRES_DATA_DIR:-}"
WWW_STATIC_DIR="${WWW_STATIC_DIR:-}"

# Track steps performed for final summary
STEPS_LOG=()

# ── Global .env summary ─────────────────────────────────────
echo "══════════════════════════════════════════════════════════"
echo "  MEDGREENREV — Deployment Configuration Summary"
echo "══════════════════════════════════════════════════════════"
echo "  Project root:     $PROJECT_ROOT"
echo "  APP_ENV:          $APP_ENV"
echo "  USER_UID:         $USER_UID"
echo "  USER_GID:         $USER_GID"
echo "  POSTGRES_DATA_DIR: $POSTGRES_DATA_DIR"
echo "  WWW_STATIC_DIR:   $WWW_STATIC_DIR"
echo "══════════════════════════════════════════════════════════"

if ! confirm "Proceed with these settings?"; then
  echo "Aborted by user."
  exit 1
fi

# ── Check current user UID/GID match ────────────────────────
CURRENT_UID="$(id -u)"
CURRENT_GID="$(id -g)"

if [ "$CURRENT_UID" != "$USER_UID" ] || [ "$CURRENT_GID" != "$USER_GID" ]; then
  echo ""
  echo "⚠  WARNING: Current user UID:GID ($CURRENT_UID:$CURRENT_GID) does not match USER_UID:USER_GID ($USER_UID:$USER_GID)"
  if ! confirm "Continue anyway?"; then
    echo "Aborted by user."
    exit 1
  fi
  STEPS_LOG+=("UID/GID mismatch warning acknowledged (current=$CURRENT_UID:$CURRENT_GID, expected=$USER_UID:$USER_GID)")
else
  STEPS_LOG+=("UID/GID match confirmed ($CURRENT_UID:$CURRENT_GID)")
fi

# ── Check WWW_STATIC_DIR ────────────────────────────────────
if [ -n "$WWW_STATIC_DIR" ]; then
  if [ ! -d "$WWW_STATIC_DIR" ]; then
    echo ""
    echo "⚠  WWW_STATIC_DIR does not exist: $WWW_STATIC_DIR"
    if confirm "Create $WWW_STATIC_DIR?"; then
      mkdir -p "$WWW_STATIC_DIR"
      echo "    Created $WWW_STATIC_DIR"
      STEPS_LOG+=("Created WWW_STATIC_DIR: $WWW_STATIC_DIR")
    else
      echo "Aborted by user."
      exit 1
    fi
  else
    STEPS_LOG+=("WWW_STATIC_DIR already exists: $WWW_STATIC_DIR")
  fi

  # ── Check WWW_STATIC_DIR/media ─────────────────────────────
  MEDIA_DIR="$WWW_STATIC_DIR/media"
  if [ ! -d "$MEDIA_DIR" ]; then
    echo ""
    echo "⚠  Media directory does not exist: $MEDIA_DIR"
    if confirm "Create $MEDIA_DIR and chown 82:82?"; then
      mkdir -p "$MEDIA_DIR"
      sudo chown 82:82 "$MEDIA_DIR"
      echo "    Created $MEDIA_DIR (owner 82:82)"
      STEPS_LOG+=("Created media directory: $MEDIA_DIR (chown 82:82)")
    else
      echo "Aborted by user."
      exit 1
    fi
  else
    STEPS_LOG+=("Media directory already exists: $MEDIA_DIR")
  fi
fi

# ── 0. Pre-flight: fix client output directory ownership ─────
echo ""
echo "==> Ensuring client/.output/public exists with correct ownership..."
mkdir -p "$PROJECT_ROOT/client/.output/public"
if [ "$(stat -c '%u' "$PROJECT_ROOT/client/.output/public")" = "0" ]; then
  echo "    Fixing root ownership → ${USER_UID}:${USER_GID}"
  sudo chown -R "${USER_UID}:${USER_GID}" "$PROJECT_ROOT/client/.output"
  STEPS_LOG+=("Fixed client/.output ownership → ${USER_UID}:${USER_GID}")
else
  STEPS_LOG+=("client/.output/public ownership OK")
fi

# ── 1. Build images ─────────────────────────────────────────
echo "==> Building Docker images..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml build php nginx node geoserver redis
STEPS_LOG+=("Docker images built")

# ── 2. SSL: init self-signed certs (nginx needs them to start)
echo "==> Initializing self-signed SSL certificates..."
docker compose run --rm certbot /opt/certbot-scripts/init-certs.sh
STEPS_LOG+=("Self-signed SSL certificates initialized")

# ── 3. Start infrastructure services ────────────────────────
echo "==> Starting database and redis..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d database redis
echo "    Waiting for database to be healthy..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec database sh -c \
  'until pg_isready -U ${POSTGRES_USER:-app}; do sleep 2; done'
STEPS_LOG+=("Database and Redis started")

# ── 4. Start PHP (migrations handled by its init script) ────
echo "==> Starting PHP..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d php
echo "    Waiting for PHP to be healthy (includes migrations)..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec php sh -c \
  'until php -v > /dev/null 2>&1; do sleep 2; done'
STEPS_LOG+=("PHP started (migrations applied)")

# ── 5. GeoServer ────────────────────────────────────────────
echo "==> Starting GeoServer..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d geoserver
STEPS_LOG+=("GeoServer started")

# ── 6. Generate client static files ─────────────────────────
echo "==> Installing client dependencies..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm node pnpm install

echo "==> Generating static client bundle..."
docker compose run -f docker-compose.yml -f docker-compose.prod.yml --rm node pnpm generate
STEPS_LOG+=("Client static files generated")

# ── 7. Start Nginx ──────────────────────────────────────────
echo "==> Starting Nginx..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d nginx
STEPS_LOG+=("Nginx started")

# ── 8. SSL: obtain real Let's Encrypt certificate ────────────
echo "==> Obtaining real SSL certificate..."
docker compose run --rm certbot /opt/certbot-scripts/renew-certs.sh
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -s reload
STEPS_LOG+=("Real SSL certificate obtained, Nginx reloaded")

# ── Final Summary ────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════════════════"
echo "  MEDGREENREV — Deployment Summary"
echo "══════════════════════════════════════════════════════════"
echo "  APP_ENV:          $APP_ENV"
echo "  USER_UID:         $USER_UID"
echo "  USER_GID:         $USER_GID"
echo "  POSTGRES_DATA_DIR: $POSTGRES_DATA_DIR"
echo "  WWW_STATIC_DIR:   $WWW_STATIC_DIR"
echo ""
echo "  Steps performed:"
for step in "${STEPS_LOG[@]}"; do
  echo "    ✔ $step"
done
echo "══════════════════════════════════════════════════════════"
echo "  Services: docker compose -f docker-compose.yml -f docker-compose.prod.yml ps"
echo "══════════════════════════════════════════════════════════"
