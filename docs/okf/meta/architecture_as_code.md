---
type: policy
title: Architecture-as-Code Development Workflow
status: active
target_file: docs/okf/
---

# Architecture-as-Code Development Workflow

## Purpose

MEDGREENREV enforces a **Spec-First / Architecture-as-Code** workflow. The Open Knowledge Format (OKF) in `docs/okf/` serves as the primary system design blueprint and single contextual ground truth for developers and AI agents.

---

## Multi-Tier Specification Workflow

1. **Tier 1 (Domain Scaffolding):** Define the domain boundaries, service components, and top-level hub index files.
2. **Tier 2 (Policy & Subsystem Invariants):** Author concrete architectural specifications (foreign key policies, validator rules, query filters, spatial views, IPC topologies) set to `status: planned` or `status: in_development`.
3. **Tier 3 (Granular Implementation Contracts):** Document per-endpoint API Platform resource operations and schema details.
4. **Code-First Verification:** Verify all architectural assertions directly against the active codebase (`api/`, `client/`, `docker/`, `deploy/`) to prevent documentation drift.
5. **Status Progression:** Update the frontmatter `status` as components transition:
   * `status: planned` $\rightarrow$ Design blueprint phase.
   * `status: in_development` $\rightarrow$ Active implementation in progress.
   * `status: active` $\rightarrow$ Implementation code is written, validated, and verified against tests.

---

## Related Nodes

* [Graph Authoring Rules](./authoring_rules.md)
* Back to [Meta Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
