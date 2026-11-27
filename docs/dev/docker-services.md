# Docker Services

## Overview

The application is orchestrated via Docker Compose. The main configuration is in `docker-compose.yml`, with development overrides in `docker-compose.override.yml` and production overrides in `docker-compose.prod.yml`.

## Services

### php

- **Image:** `php:8.4-fpm-alpine` (custom Dockerfile at `docker/php/Dockerfile`)
- **Purpose:** Runs the Symfony 7.x API application.
- **Volumes:**
  - `./api:/srv/api` — application source
  - `${WWW_STATIC_DIR}:/srv/static` — media/import files
  - Shared sockets: `php_socket`, `pg_socket`, `redis_socket`
- **Environment:**
  - `CLIENT_BODY_SIZE` — controls `upload_max_filesize` and `post_max_size` via `envsubst` at container startup.
- **Health check:** `php -v`
- **Dev target:** `app_php_dev` (adds Xdebug, dev php.ini)

### database

- **Image:** `postgis/postgis:{POSTGRES_VERSION}-{POSTGIS_VERSION}-alpine`
- **Purpose:** PostgreSQL + PostGIS database.
- **Volumes:** `${POSTGRES_DATA_DIR}:/var/lib/postgresql/data`
- **Health check:** `pg_isready`

### nginx

- **Image:** `nginx:1.30-alpine`
- **Purpose:** Reverse proxy serving the API, static client app (`/app/`), media files, and proxying GeoServer.
- **Ports:** `${NGINX_PORT:-8000}:80`
- **Volumes:**
  - `client_output:/srv/client:ro` — generated Nuxt static files (shared with `node` service)
  - `${WWW_STATIC_DIR}:/srv/static:ro` — media files
  - Nginx config templates in `docker/nginx/templates/`
- **Environment:**
  - `NGINX_HOST` — server name
  - `CLIENT_BODY_SIZE` — `client_max_body_size` directive (via nginx template substitution)

### redis

- **Image:** Custom build from `docker/redis/Dockerfile`, based on `redis:8.2-alpine` (upgraded from `redis:7.4-alpine`).
- **Purpose:** Caching and message broker.
- **Health check:** `redis-cli ping` via Unix socket.
- **Upgrade notes (7.4 → 8.2):**
  - The `7.4 → 8.2` upgrade is a single, officially supported hop per Redis's upgrade matrix (no intermediate hop through `8.0` required).
  - No persistence/RDB migration concerns for this deployment: `docker/redis/redis.conf` defines no `save`/AOF directives, so the container always starts with an empty, ephemeral dataset (cache + transient queue data only).
  - No configuration changes were required: `port 0` + `unixsocket`/`unixsocketperm` directives are unaffected by the version bump, and no ACL rules are defined, so the Redis 8.x ACL category-widening change does not apply.
  - **Licensing note:** as of Redis `8.0+`, Redis Open Source is available under a tri-license choice (RSALv2, SSPLv1, or AGPLv3), whereas `7.4` only offered RSALv2/SSPLv1. No action is required unless the project has specific licensing constraints.

### geoserver

- **Image:** Custom build from `docker/geoserver/Dockerfile` (GeoServer 3.0.x series on Tomcat 11 / Java 17)
- **Purpose:** Geospatial data server with PostGIS integration.
- **Volumes:** `./docker/geoserver/data:/opt/geoserver_data`
- **Environment:** PostgreSQL JNDI connection, admin credentials, GeoServer extensions (`wps,kml`).
- **Health check:** Script (`/opt/healthcheck.sh`) querying base endpoint and WPS `GetCapabilities`.

### node

- **Image:** `node:22-alpine` (custom Dockerfile at `docker/node/Dockerfile`)
- **Purpose:** Nuxt 4 client development and static site generation. **Not a runtime service.**
- **Profile:** `tools` — does **not** start with `docker compose up -d`.
- **Volumes:**
  - `./client:/srv/client` — client source code
  - `client_output:/srv/client/.output/public` — generated static files (shared with nginx)
- **Environment:**
  - `NUXT_PUBLIC_API_BASE_URL` — browser-accessible API URL (must be reachable from the user's browser, not Docker-internal)
  - `NUXT_PUBLIC_CLIENT_MAX_BODY_SIZE` — max upload size for client validation
- **Usage:**
  ```bash
  docker compose run --rm node pnpm install
  docker compose run --rm node pnpm generate
  docker compose run --rm --service-ports node pnpm dev
  ```

### certbot

- **Image:** `certbot/certbot:latest`
- **Profile:** `tools` — does not start with `docker compose up -d`.
- **Purpose:** SSL certificate management (Let's Encrypt).

## Named Volumes

| Volume | Shared between | Purpose |
|---|---|---|
| `php_socket` | php, nginx | PHP-FPM Unix socket |
| `pg_socket` | php, database | PostgreSQL Unix socket |
| `redis_socket` | php, redis | Redis Unix socket |
| `client_output` | node, nginx | Nuxt generated static files |

## Environment Variables

All environment variables are defined in `.env.dist` (copy to `.env` and customize). Key variables:

| Variable | Default | Used by |
|---|---|---|
| `NGINX_HOST` | `localhost` | nginx, certbot, geoserver, node |
| `NGINX_PORT` | `80` | nginx, node |
| `CLIENT_BODY_SIZE` | `10M` | nginx, php, node |
| `WWW_STATIC_DIR` | — | php, nginx |
| `POSTGRES_DATA_DIR` | — | database |
| `APP_ENV` | `prod` | geoserver |

## Startup

```bash
# Start all runtime services (node and certbot excluded)
docker compose up -d

# Build and generate client static files
docker compose run --rm node pnpm install
docker compose run --rm node pnpm generate
```
