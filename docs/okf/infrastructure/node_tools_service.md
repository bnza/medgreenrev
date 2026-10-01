---
type: infrastructure_service
title: Node Tools & Frontend Builder Service
status: active
target_file: docker-compose.yml
service_name: node
---

# Node Tools & Frontend Builder Service

## Architectural Role

The `node` container provides an on-demand Node.js 22 runtime for frontend development tasks, package management via `pnpm`, OpenAPI client synchronization (`pnpm generate:all`), and static site compilation (`pnpm generate`). It belongs to the `tools` Docker Compose profile and is invoked on demand rather than running as a persistent daemon.

## Developer Workflows & Output Sharing

* **Execution Model:** Run on demand via `docker compose run --rm node <command>`.
* **Shared Output Volume:** Compiles the Nuxt 4 SPA to `/srv/client/.output/public`, which is directly mounted into the `nginx` container for static serving at `/app/`.
* **API Base URL:** Configured with `NUXT_PUBLIC_API_BASE_URL` to ensure that browser-facing API requests resolve correctly.

## Key Relationships

* **Declaration / Implementation:** [docker-compose.yml](../../../docker-compose.yml) (`services.node`)
* **Client Application Root:** [client/](../../../client/)
* **Frontend Architecture:** [Frontend Client Architecture](../frontend/client_architecture.md)
* **Workflows:** [Client Synchronization Workflow](../workflows/client_sync.md)

## Related Nodes

* Back to [Infrastructure Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
