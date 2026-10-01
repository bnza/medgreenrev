---
type: workflow
title: Client Synchronization & Build Workflow
status: active
target_file: client/package.json
---

# Client Synchronization & Build Workflow

## Architectural Role

This workflow governs the synchronization between backend API resource changes and frontend TypeScript contracts, as well as the static compilation lifecycle of the Nuxt 4 SPA.

## Synchronization Steps

1. **Update API Resources & Types:** Run `pnpm generate:all` inside the `node` container (`docker compose run --rm node pnpm generate:all`) to regenerate `types/openapi.d.ts` and `app/utils/consts/resources.ts`.
2. **Refresh Runtime OpenAPI Cache:** The PHP container caches the runtime OpenAPI document at startup; execute `docker compose restart php` whenever API Platform serialization or resource metadata changes.
3. **Compile Static Output:** Generate compiled assets into `.output/public` via `docker compose run --rm node pnpm generate`, making them immediately available to Nginx at `/app/`.

## Key Relationships

* **Client Package Manifest:** [client/package.json](../../../client/package.json)
* **Frontend Architecture:** [Frontend Client Architecture](../frontend/client_architecture.md)
* **Node Tools Service:** [Node Tools Service](../infrastructure/node_tools_service.md)
* **Nginx Service:** [Nginx Service](../infrastructure/nginx_service.md)

## Related Nodes

* Back to [Workflows Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
