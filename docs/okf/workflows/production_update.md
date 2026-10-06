---
type: workflow
title: Production Update Workflow (Running Server)
status: active
target_file: docker-compose.prod.yml
---

# Production Update Workflow (Running Server)

## Architectural Role

Procedure to run on an **already running** production server after new commits are pulled. It is a non-destructive update: no SSL initialisation, no fixtures, no database drop. For the first-time install see [Server & Container Deployment Workflow](./server_deployment.md).

---

## Preconditions

* The stack is up (`docker compose ... ps` shows `database`, `redis`, `php`, `nginx`, `geoserver` running).
* Commands run from the project root (`/home/pi/dev/projects/medgreenrev` on the server checkout).
* Shell alias used throughout:

```bash
DC="docker compose -f docker-compose.yml -f docker-compose.prod.yml"
```

---

## Mount Model (why most updates need no rebuild)

* `./api` is bind-mounted into `php` and `nginx` by the base `docker-compose.yml`; `docker-compose.prod.yml` only overrides the build target (`app_php`), `APP_ENV=prod`, the nginx template, ports and logging. The mount therefore also applies in production and hides the `api/` copy baked into the image: `git pull` updates the code the container runs.
* `./client/.output/public` is mounted into `nginx` (`/srv/client_output`); `pnpm generate` in the `node` container writes there, so new static files are served immediately.
* Because `./api` is a bind mount, `api/var/cache/prod` lives on the host and **survives restarts and rebuilds**.
* The image must be rebuilt only when `docker/php/` (Dockerfile, `conf.d/*`, entrypoint) changes.

---

## Ordered Procedure

1. **Back up the database** (migrations run automatically on php start):

   ```bash
   deploy/db-backup.sh
   ```

2. **Pull and inspect what changed:**

   ```bash
   git pull
   git diff --stat HEAD@{1} HEAD
   ```

   Use the [decision table](#decision-table) to pick the following steps.

3. **Sync `.env`:** if `.env.example` gained variables, add them to the server's `.env` before restarting php.

4. **Rebuild php (only if `docker/php/` changed):**

   ```bash
   $DC build php
   $DC up -d php
   ```

5. **Clear the Symfony prod cache, then restart php:**

   ```bash
   $DC exec php bin/console cache:clear --env=prod
   $DC restart php
   $DC logs -f php
   ```

   * `docker/php/docker-entrypoint.sh` does **not** run `cache:clear`. A restart alone therefore keeps the compiled cache (validator metadata, routes, container) stored in `api/var/cache/prod` on the bind mount, so the old behaviour persists. `cache:clear` is the step that actually refreshes it.
   * The restart is still required: php-fpm keeps opcache in memory (`opcache.validate_timestamps` is not set in the repo) and loads `config/preload.php` only at start.
   * On start the entrypoint also runs `composer install`, applies pending migrations (`doctrine:migrations:migrate --all-or-nothing`), fixes ACLs on `var/` and regenerates `public/docs.jsonopenapi.json`. Watch the logs for migration errors.

6. **Rebuild the client (only if `client/` changed; safe to run every time):**

   ```bash
   $DC run --rm node pnpm install
   $DC run --rm node pnpm generate
   ```

   Client-side validation (e.g. the archaeological site code regex) only changes after this step plus a browser hard refresh. Do not run `pnpm generate:all` on the server; generated `resources.ts` / `openapi.d.ts` must be committed from development.

7. **Reload nginx (only if nginx config/template changed):**

   ```bash
   $DC up -d nginx
   $DC exec nginx nginx -s reload
   ```

8. **Verify:**

   ```bash
   $DC ps
   $DC exec php bin/console doctrine:migrations:status
   ```

   Then open `/app/` and `/api/docs` in a browser. If a GeoServer view migration changed (e.g. `Version20260323152247`), check that the layers still load.

---

## Decision Table

| Changed path | Required actions |
|--------------|------------------|
| `api/src`, `api/config`, `api/templates` | `cache:clear --env=prod`, `restart php` |
| `api/migrations` | Backup first, `cache:clear`, `restart php` (migrations apply on start), verify `migrations:status` |
| `api/composer.*` | `restart php` (entrypoint runs `composer install`), `cache:clear` |
| `docker/php/` | `build php`, `up -d php`, `cache:clear` |
| `docker/nginx/` | `up -d nginx`, `nginx -s reload` |
| `client/` | `pnpm install`, `pnpm generate` |
| `.env.example` | Update the server `.env`, then `restart php` (and any service reading the new variable) |
| `docker-compose*.yml` | `$DC up -d` for the affected services |

---

## Troubleshooting

* **Stale validation message** (e.g. `ArchaeologicalSite code must have up to 6 characters` although the source allows 10): the compiled validator metadata is in `api/var/cache/prod`. Check with `git log --oneline -1 -- api/src/Entity/Data/ArchaeologicalSite.php`, then run step 5 and step 6, and hard-refresh the browser.
* **Cache file permissions:** `exec ... cache:clear` may create files as root, unreadable by the php-fpm user. Restarting php lets the entrypoint reapply ACLs on `var/`; otherwise run the clear as the correct user (`$DC exec -u www-data php ...`).
* **Migration failure:** php logs show the error and the migration runs `--all-or-nothing`. Fix the migration (as a new incremental one) or restore the backup made in step 1, then restart php.
* **Stale OpenAPI spec:** `/docs.jsonopenapi.json` is generated only at php start; restart php after any API schema change.

---

## Migration Caveat

The dev-phase practice of regenerating `Version20250621090503` does **not** work on production: it is already recorded as applied, so edits never run. Production changes require new incremental migrations (views, triggers and functions go into the matching purpose-specific migration or a new one).

---

## Do Not Run on an Update

* `deploy/deploy.sh` (first-install script: re-initialises SSL certificates).
* `hautelook:fixtures:load`.
* `doctrine:database:drop` or any database rebuild.

---

## Key Relationships

* **Compose Override:** [docker-compose.prod.yml](../../../docker-compose.prod.yml)
* **PHP Entrypoint:** [docker/php/docker-entrypoint.sh](../../../docker/php/docker-entrypoint.sh)
* **Backup Script:** [deploy/db-backup.sh](../../../deploy/db-backup.sh)

---

## Related Nodes

* [Server & Container Deployment Workflow](./server_deployment.md)
* [Database Lifecycle & Migration Workflow](./database_lifecycle.md)
* [Client Synchronization & Build Workflow](./client_sync.md)
* Back to [Workflows Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
