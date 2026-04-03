# Client Development

## Overview

The client is a Nuxt 4 SPA (Single Page Application) with `ssr: false`. It lives in the `client/` directory and runs inside a Docker `node` container for development and static site generation.

Since SSR is disabled, all API calls happen **in the browser**. The `NUXT_PUBLIC_API_BASE_URL` environment variable must always point to a **browser-accessible** URL (e.g., `http://localhost:8000`), never a Docker-internal hostname.

## Prerequisites

Build the node Docker image (first time only):

```bash
docker compose build node
```

Install dependencies:

```bash
docker compose run --rm node pnpm install
```

## Development Server

Run the Nuxt dev server with hot module replacement:

```bash
docker compose run --rm --service-ports node pnpm dev
```

- The dev server is available at `http://localhost:3000/app/`
- The API is served by nginx at `http://localhost:${NGINX_PORT:-8000}`
- `--service-ports` is required to expose port 3000

## Static Site Generation

Generate the static SPA bundle:

```bash
docker compose run --rm node pnpm generate
```

The generated files are written to `client/.output/public/` inside the container, which is mounted as the `client_output` named volume. Nginx serves these files at `/app/`.

### Production Generate

For production, ensure `NGINX_HOST` and `NGINX_PORT_SSL` are correctly set in your `.env` file (the `node` service in `docker-compose.yml` uses `NUXT_PUBLIC_API_BASE_URL=https://${NGINX_HOST}:${NGINX_PORT_SSL:-443}`):

```bash
# .env
NGINX_HOST=yourdomain.com
NGINX_PORT_SSL=443
```

Then generate:

```bash
docker compose run --rm node pnpm generate
```

## Testing

### Unit Tests

```bash
docker compose run --rm node pnpm test:unit:run
```

### E2E Tests

```bash
docker compose run --rm node pnpm test:e2e
```

## Environment Variables

The `node` service receives these environment variables via Docker Compose:

| Variable | Purpose | Dev default |
|---|---|---|
| `NUXT_PUBLIC_API_BASE_URL` | API base URL (must be browser-accessible) | `http://localhost:8080` |
| `NUXT_PUBLIC_CLIENT_MAX_BODY_SIZE` | Max upload file size for client-side validation | `10M` |

These are set in `docker-compose.yml` (production defaults) and overridden in `docker-compose.override.yml` (dev defaults).

## Key Configuration

- **Nuxt config:** `client/nuxt.config.ts`
- **App base URL:** `/app/` (configured in `nuxt.config.ts` as `app.baseURL`)
- **SSR:** Disabled (`ssr: false`) — the app is a pure SPA
- **Package manager:** pnpm (enabled via corepack in the Docker image)
