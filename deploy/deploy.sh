#!/bin/bash
set -euo pipefail

# ──────────────────────────────────────────────────────────────
# MEDGREENREV — Production Deployment Script
# Based on: docs/dev/docker-deployement.md, server-setup.md,
#           client-development.md
# ──────────────────────────────────────────────────────────────

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Source .env for USER_UID/USER_GID defaults
if [ -f .env ]; then
  # shellcheck disable=SC2046
  export $(grep -v '^#' .env | xargs)
fi

USER_UID="${USER_UID:-1000}"
USER_GID="${USER_GID:-1000}"

echo "==> Project root: $PROJECT_ROOT"
echo "==> USER_UID=$USER_UID  USER_GID=$USER_GID"

# ── 0. Pre-flight: fix client output directory ownership ─────
# Nginx mounts ./client/.output/public. If Docker creates it
# before node writes to it, it gets root:root ownership and
# pnpm generate fails. Pre-create with correct ownership.
echo "==> Ensuring client/.output/public exists with correct ownership..."
mkdir -p "$PROJECT_ROOT/client/.output/public"
if [ "$(stat -c '%u' "$PROJECT_ROOT/client/.output/public")" = "0" ]; then
  echo "    Fixing root ownership → ${USER_UID}:${USER_GID}"
  sudo chown -R "${USER_UID}:${USER_GID}" "$PROJECT_ROOT/client/.output"
fi

# ── 1. Build images ─────────────────────────────────────────
echo "==> Building Docker images..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml build php nginx node geoserver redis

# ── 2. SSL: init self-signed certs (nginx needs them to start)
echo "==> Initializing self-signed SSL certificates..."
docker compose run --rm certbot /opt/certbot-scripts/init-certs.sh

# ── 3. Start infrastructure services ────────────────────────
echo "==> Starting database and redis..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d database redis
echo "    Waiting for database to be healthy..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec database sh -c \
  'until pg_isready -U ${POSTGRES_USER:-app}; do sleep 2; done'

# ── 4. Start PHP (migrations handled by its init script) ────
echo "==> Starting PHP..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d php
echo "    Waiting for PHP to be healthy (includes migrations)..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec php sh -c \
  'until php -v > /dev/null 2>&1; do sleep 2; done'

# ── 5. GeoServer ────────────────────────────────────────────
echo "==> Starting GeoServer..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d geoserver

# ── 6. Generate client static files ─────────────────────────
echo "==> Installing client dependencies..."
docker compose run --rm node pnpm install

echo "==> Generating static client bundle..."
docker compose run --rm node pnpm generate

# ── 7. Start Nginx ──────────────────────────────────────────
echo "==> Starting Nginx..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d nginx

# ── 8. SSL: obtain real Let's Encrypt certificate ────────────
echo "==> Obtaining real SSL certificate..."
docker compose run --rm certbot /opt/certbot-scripts/renew-certs.sh
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -s reload

echo ""
echo "==> Deployment complete!"
echo "    Services: docker compose -f docker-compose.yml -f docker-compose.prod.yml ps"