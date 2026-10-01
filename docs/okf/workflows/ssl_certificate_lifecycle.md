---
type: workflow
title: SSL Certificate Lifecycle & Renewal Workflow
status: active
target_file: docker/certbot/
---

# SSL Certificate Lifecycle & Renewal Workflow

## Architectural Role

Production HTTPS termination for MEDGREENREV is handled by the Nginx web server using Let's Encrypt certificates managed through the Certbot CLI. The workflow resolves the circular dependency between Nginx startup and ACME challenge validation via a dual-stage provisioning process.

---

## The Bootstrap Dependency Problem

In production mode, [docker/nginx/templates/prod.site.conf.template](../../../docker/nginx/templates/prod.site.conf.template) configures SSL listeners on port 443 that require certificate files:

```
ssl_certificate /etc/letsencrypt/live/${NGINX_HOST}/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/${NGINX_HOST}/privkey.pem;
```

If these files are missing on a fresh host, Nginx terminates immediately with a configuration error. However, Certbot's standard HTTP-01 webroot challenge requires Nginx to be online and serving requests on port 80 under `/.well-known/acme-challenge/`.

---

## Dual-Stage Provisioning Architecture

```
[Stage 1: Bootstrap] 
   └── Run init-certs.sh inside certbot container
       ├── Generate temporary self-signed RSA certificate
       └── Place in /etc/letsencrypt/live/${NGINX_HOST}/
[Nginx Startup] 
   └── Start Nginx; SSL server loads self-signed cert, port 80 listens for ACME
[Stage 2: Acquisition / Renewal] 
   └── Run renew-certs.sh inside certbot container
       ├── Remove self-signed certificate if no renewal config exists
       ├── Execute certbot certonly --webroot -w /var/www/certbot -d ${NGINX_HOST}
       ├── Nginx routes /.well-known/acme-challenge/ from certbot_challenges volume
       └── Reload Nginx (nginx -s reload) to load production certificates
```

### Stage 1: Temporary Bootstrap Certificate (`docker/certbot/init-certs.sh`)

Executed before starting Nginx during initial provisioning:

1. Checks if a valid certificate chain already exists in `/etc/letsencrypt/live/${NGINX_HOST}/fullchain.pem`. If found, skips generation.
2. Creates `/etc/letsencrypt/live/${NGINX_HOST}/` and generates a temporary 2048-bit RSA self-signed certificate valid for 1 day.
3. Sets ownership on `/etc/letsencrypt/` to `${USER_UID}:${USER_GID}` to prevent root permission conflicts with host operations.
4. Allows Nginx to start successfully and begin listening for incoming traffic.

### Stage 2: ACME Certificate Acquisition & Renewal (`docker/certbot/renew-certs.sh`)

Executed after Nginx is online, and on a regular schedule thereafter:

1. Checks for the existence of `/etc/letsencrypt/renewal/${NGINX_HOST}.conf`.
2. If the renewal configuration is absent (indicating the current certificate is self-signed), removes the temporary self-signed certificate directory.
3. Executes Certbot in webroot mode:
   * Uses webroot path `/var/www/certbot/` (mounted via the shared `certbot_challenges` volume).
   * Passes `--keep-until-expiring` so certificates are only renewed when within 30 days of expiration.
   * Uses `${CERTBOT_EMAIL}` or `--register-unsafely-without-email` if no email is set.
4. Resets directory permissions to `${USER_UID}:${USER_GID}`.
5. Signals Nginx to reload its configuration and active TLS certificates:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -s reload
   ```

---

## Automated Renewal Scheduling (Cron)

Let's Encrypt certificates are valid for 90 days. To automate renewal on the host server, a weekly cron job executes the renewal workflow:

```bash
# Example host crontab entry (/etc/cron.weekly/certbot-renew or crontab -e)
0 3 * * 1 cd /path/to/medgreenrev && docker compose run --rm certbot /opt/certbot-scripts/renew-certs.sh && docker compose -f docker-compose.yml -f docker-compose.prod.yml exec nginx nginx -s reload
```

---

## Key Relationships

* **Certificate Initialization Script:** [docker/certbot/init-certs.sh](../../../docker/certbot/init-certs.sh)
* **Certificate Renewal Script:** [docker/certbot/renew-certs.sh](../../../docker/certbot/renew-certs.sh)
* **Certbot Service Specification:** [Certbot SSL Service Node](../infrastructure/certbot_service.md)
* **Production Nginx Template:** [docker/nginx/templates/prod.site.conf.template](../../../docker/nginx/templates/prod.site.conf.template)
* **Server Deployment Workflow:** [Server & Container Deployment Workflow](./server_deployment.md)

---

## Related Nodes

* Back to [Workflows Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
