---
type: policy
title: Graph Authoring & Non-Duplication Policy
status: active
target_file: docs/okf/
---

# Graph Authoring & Non-Duplication Policy

## Operational Rules for AI Agents & Contributors

### 1. Multi-Tier Knowledge Graph Hierarchy

The OKF documentation in `docs/okf/` is organized into three distinct architectural tiers:

* **Tier 1 — High-Level Topology & Domain Hubs:** Master index (`docs/okf/index.md`), six domain hub index files (`meta/index.md`, `infrastructure/index.md`, `backend/index.md`, `frontend/index.md`, `testing/index.md`, `workflows/index.md`), and high-level service/component overview nodes.
* **Tier 2 — Subsystem Specifications & Policies:** Granular specifications defining system-wide invariants, data policies, and operational lifecycles (e.g., `api_platform.md`, `foreign_key_policies.md`, `analysis_validation_constraints.md`, `query_extensions_filtering.md`, `geoserver.md`, `socket_ipc_topology.md`, `ssl_certificate_lifecycle.md`, `server_deployment.md`, `client_architecture.md`, `webgis_mapping.md`, `state_data_layer.md`, `search_filtering.md`, `resource_crud_workflow.md`, `fixtures_test_data.md`).
* **Tier 3 — Granular API & Implementation Contracts:** Per-entity API Platform contracts, individual composable specifications, and specific database trigger/view definitions linked directly to implementation files.

---

### 2. Code-First Ground Truth Principle

* **Live Code Authority:** All architectural assertions, validator constraints, database triggers, foreign key behaviors, deployment pipelines, and configuration options documented in OKF must be verified directly against the active codebase (`api/`, `client/`, `docker/`, `deploy/`).
* **Legacy Documentation Advisory:** Documents located in legacy folders such as `docs/dev/` represent historical records and may contain obsolete procedures, stale configuration names, or superseded assumptions. In any discrepancy between `docs/dev/` and live codebase files, the live codebase is the sole authoritative source of truth.
* **Strict Exclusion of Internal Agent Artifacts:** Internal planning files, session transcripts, scratchpads, and configuration artifacts in `.junie/` must be completely excluded from documentation. No OKF node may cite, link to, or incorporate content from `.junie/`.

---

### 3. Single Source of Truth (Zero Duplication)

* Never duplicate raw configuration files, extensive code snippets, SQL DDL statements, or environment dumps into OKF Markdown prose.
* Explain the **architectural role**, **intent**, **invariants**, and **relationships** in structured Markdown prose, and point directly to implementation files using relative links and the `target_file` frontmatter attribute.

---

### 4. Target Resolution Contract

Every node representing a concrete file or directory MUST specify its path in the frontmatter using `target_file`. CI tools and AI agents must handle `target_file` according to node status:

| Status | `target_file` Requirement | CI / Linter Action | Agent Behavior |
|:---|:---|:---|:---|
| `active` | Required | Asserts target path exists on disk (`stat()`) | Direct read/write permitted |
| `planned` | Required (if mapping to file) | Validates path syntax; skips existence check | Treat as scaffolding destination |
| `draft` / `deprecated` | Optional | Non-blocking | Context only |

---

## Related Nodes

* [Architecture-as-Code Principles](./architecture_as_code.md)
* Back to [Meta Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
