# MEDGREENREV

Containerized application: Symfony API + Nuxt 4 SPA client.

## Quick Start

```bash
# Copy and configure environment
cp .env.dist .env

# Start the API stack (database, php, nginx, redis, geoserver)
docker compose up -d

# Build node image and generate client
docker compose build node
docker compose run --rm node pnpm install
docker compose run --rm node pnpm generate

# Run Nuxt dev server (port 3000)
docker compose run --rm --service-ports node pnpm dev
```

## Documentation

### Developer

- [Server Setup](docs/dev/server-setup.md)
- [Docker Services](docs/dev/docker-services.md)
- [Client Development](docs/dev/client-development.md)
- [Foreign Key Policies](docs/dev/foreign-key-delete-policies.md)

### User

- [Index](docs/user/index.md)

## Development

### Setup Git Hooks

To ensure automated code style checks before commits, please set up the Git hooks locally by running:

```bash
./deploy/git/setup-git-hooks.sh
```
