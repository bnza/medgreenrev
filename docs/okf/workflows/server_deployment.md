---
type: workflow
title: Server & Container Deployment Workflow
status: active
target_file: deploy/deploy.sh
---

# Server & Container Deployment Workflow

## Architectural Role

Production deployment of MEDGREENREV is orchestrated through automated deployment scripts and multi-file Docker Compose configurations (`docker-compose.yml` + `docker-compose.prod.yml`), supervised by systemd on the host Linux system.

---

## Deployment Architecture & Artifacts

* **Deployment Automation Script:** [deploy/deploy.sh](../../../deploy/deploy.sh) – Full deployment pipeline handling pre-flight checks, image building, SSL bootstrapping, service startup, client asset compilation, and final Let's Encrypt certificate issuance.
* **Production Compose Configuration:** [docker-compose.prod.yml](../../../docker-compose.prod.yml) – Overrides development settings with production PHP build target (`app_php`), `APP_ENV=prod`, production Nginx template, local Docker log rotation (10 MB, 3 files max), and port bindings (80/443).
* **Systemd Unit Template:** [deploy/systemd/medgreenrev.docker-compose.service.template](../../../deploy/systemd/medgreenrev.docker-compose.service.template) – Host service template ensuring automatic startup on server boot and journald log forwarding.
* **Database Backup Utilities:** [deploy/db-backup.sh](../../../deploy/db-backup.sh) and [deploy/backup_to_nfs.sh](../../../deploy/backup_to_nfs.sh) – Scheduled database dump and remote NFS backup utilities.

---

## Configuration & Environment Contracts

Production execution requires environment variables defined in root `.env` and `api/.env.prod.local`:

### 1. Root `.env` (Docker & Infrastructure)

* `APP_ENV=prod`: Sets production operational mode across containers.
* `USER_UID` / `USER_GID`: Host user and group IDs (typically 1000) for unprivileged volume mounting.
* `POSTGRES_DATA_DIR`: Host path for PostgreSQL database persistence.
* `POSTGRES_BACKUP_DIR`: Host path for SQL dump storage.
* `WWW_STATIC_DIR`: Host path for static file storage, containing `media/` (owned by UID/GID 82:82 for Alpine `www-data`).
* `NGINX_HOST`: Fully qualified domain name (FQDN) for Nginx server block and SSL certificate subject.
* `CERTBOT_EMAIL`: Admin email for Let's Encrypt expiration and security notices.
* `CLIENT_BODY_SIZE`: Max HTTP request body size (e.g. `10M`).

### 2. `api/.env.prod.local` (Symfony Application Secrets)

* `APP_SECRET`: Cryptographically random secret string for Symfony security tokens.
* `DATABASE_URL`: PostgreSQL connection DSN for the production database.
* `TRUSTED_HOSTS`: Regex matching allowed Host headers (e.g. `^app\.example\.com$`).
* `CORS_ALLOW_ORIGIN`: Regex matching authorized frontend origins.
* `JWT_PASSPHRASE`: Passphrase for Lexik JWT private/public key authentication.

---

## Deployment Execution Pipeline (`deploy/deploy.sh`)

The deployment process follows a sequential 9-step execution pipeline:

```
[0. Pre-Flight Checks] 
   └── Verify UID/GID, create WWW_STATIC_DIR/media (chown 82:82), check client output dirs
[1. Build Docker Images] 
   └── Build php, nginx, node, geoserver, redis with docker-compose.prod.yml
[2. Initialize Self-Signed SSL] 
   └── Run certbot init-certs.sh so Nginx can start SSL listeners
[3. Start Infrastructure] 
   └── Start database and redis, wait for pg_isready healthcheck
[4. Start Backend (PHP)] 
   └── Start php container, run automated migrations and OpenAPI export
[5. Start GeoServer] 
   └── Start geoserver container, run init.sh security credential hashing
[6. Generate Client Static Bundle] 
   └── Run node container: pnpm install && pnpm generate into client_output volume
[7. Start Web Server (Nginx)] 
   └── Start nginx with prod.site.conf.template serving /app/ and proxying /api/ & /geoserver/
[8. Obtain Real SSL Certificate] 
   └── Run certbot renew-certs.sh via ACME webroot challenge and reload nginx
```

### Key Operational Steps

1. **Pre-flight Checks:** Verifies UID/GID alignment to prevent file ownership conflicts; ensures `WWW_STATIC_DIR/media` exists with `82:82` ownership.
2. **SSL Bootstrapping:** Executes [docker/certbot/init-certs.sh](../../../docker/certbot/init-certs.sh) to create a temporary self-signed certificate, resolving the circular dependency where Nginx requires certificate files to start and Certbot requires Nginx to validate HTTP-01 ACME challenges.
3. **Database Health & Migrations:** Waits for PostgreSQL via `pg_isready`; the `php` container entrypoint automatically executes `doctrine:migrations:migrate --no-interaction --all-or-nothing`.
4. **GeoServer Credential Setup:** GeoServer entrypoint checks and hashes administrative credentials on first run without clobbering existing configs on subsequent restarts.
5. **Client Build:** Node container builds the Nuxt 4 SPA client in static mode (`pnpm generate`), publishing assets directly to the shared `client_output` volume mounted by Nginx.
6. **Certificate Finalization:** Certbot requests production Let's Encrypt certificates and triggers `nginx -s reload` to switch from self-signed to production certificates.

---

## Systemd Service Management

To enable automated restart on system boot:

1. Copy and configure the template:
   ```bash
   sudo cp deploy/systemd/medgreenrev.docker-compose.service.template /etc/systemd/system/medgreenrev.service
   ```
2. Replace `${DOCKER_USER}` and `${DOCKER_COMPOSE_DIRECTORY}` with host values.
3. Enable and start the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable medgreenrev.service
   sudo systemctl start medgreenrev.service
   ```

---

## Key Relationships

* **Deployment Script:** [deploy/deploy.sh](../../../deploy/deploy.sh)
* **Production Docker Compose:** [docker-compose.prod.yml](../../../docker-compose.prod.yml)
* **Systemd Unit Template:** [deploy/systemd/medgreenrev.docker-compose.service.template](../../../deploy/systemd/medgreenrev.docker-compose.service.template)
* **SSL Lifecycle:** [SSL Certificate Lifecycle & Renewal Workflow](./ssl_certificate_lifecycle.md)
* **PHP Container Entrypoint:** [docker/php/docker-entrypoint.sh](../../../docker/php/docker-entrypoint.sh)

---

## Related Nodes

* Back to [Workflows Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
