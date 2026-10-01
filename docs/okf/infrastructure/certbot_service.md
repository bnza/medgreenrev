---
type: infrastructure_service
title: Certbot SSL Certificate Management Service
status: active
target_file: docker-compose.yml
service_name: certbot
---

# Certbot SSL Certificate Management Service

## Architectural Role

The `certbot` service manages Let's Encrypt SSL/TLS certificates for automated HTTPS encryption on the production Nginx web server. It runs as an on-demand container under the `tools` Docker Compose profile.

---

## Service Specification (`docker-compose.yml`)

* **Container Image:** `certbot/certbot:latest`
* **Docker Compose Profile:** `tools` (excluded from default `docker compose up -d` daemon startup; executed on demand via `docker compose run --rm certbot <command>`).
* **Volume Mounts:**
  * `./docker/certbot/www/:/var/www/certbot/:rw` – Webroot challenge directory shared with Nginx for ACME HTTP-01 challenge verification (`certbot_challenges`).
  * `./docker/certbot/conf/:/etc/letsencrypt/:rw` – Storage for Let's Encrypt live keys, certificates, account metadata, and renewal configurations (`certbot_conf`).
  * `./docker/certbot/init-certs.sh:/opt/certbot-scripts/init-certs.sh:ro` – Initial bootstrap script for self-signed certificates.
  * `./docker/certbot/renew-certs.sh:/opt/certbot-scripts/renew-certs.sh:ro` – Certificate acquisition and renewal script.
* **Environment Variables:**
  * `NGINX_HOST`: Fully qualified domain name.
  * `CERTBOT_EMAIL`: Administrator email for renewal notifications.
  * `USER_UID` / `USER_GID`: User and group IDs applied to `/etc/letsencrypt/` via `chown` to avoid root-locked volume permissions.
* **Logging:** Local Docker log rotation (max size 5 MB, 2 files).

---

## Operational Workflows

* **Bootstrap Initialization:** [docker/certbot/init-certs.sh](../../../docker/certbot/init-certs.sh) creates temporary self-signed certificates to allow Nginx to start its SSL listeners.
* **Production Renewal:** [docker/certbot/renew-certs.sh](../../../docker/certbot/renew-certs.sh) performs non-interactive ACME webroot challenge verification (`certonly --webroot -w /var/www/certbot -d ${NGINX_HOST}`).

---

## Key Relationships

* **Compose Configuration:** [docker-compose.yml](../../../docker-compose.yml)
* **SSL Renewal Workflow:** [SSL Certificate Lifecycle & Renewal Workflow](../workflows/ssl_certificate_lifecycle.md)
* **Deployment Workflow:** [Server & Container Deployment Workflow](../workflows/server_deployment.md)
* **Web Server Service:** [Nginx Reverse Proxy & Static Server](./nginx_service.md)

---

## Related Nodes

* Back to [Infrastructure Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
