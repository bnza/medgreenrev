---
type: index
title: Operational & Developer Workflows
description: Standard operating procedures for database lifecycle management, server deployment, SSL provisioning, OpenAPI synchronization, and test suite execution.
version: 0.2.0
status: active
---

# Operational & Developer Workflows

## Overview

This directory defines standardized development, maintenance, and operational workflows for developers and AI agents working on MEDGREENREV.

---

## Standard Workflows

* [Database Lifecycle & Migration Workflow](./database_lifecycle.md) – Procedures for pre-1.0.0 development rebuilds, schema regeneration, purpose-specific migrations, and post-1.0.0 production incremental migrations.
* [GeoServer Operations & Entity Integration Workflow](./geoserver_operations.md) – Procedures for creating PostGIS spatial views, registering REST feature types, configuring API Platform feature collection endpoints, and verifying WFS test suites.
* [Server & Container Deployment Workflow](./server_deployment.md) – Automated production deployment pipeline, Docker Compose overrides, environment secrets, and systemd service supervision.
* [SSL Certificate Lifecycle & Renewal Workflow](./ssl_certificate_lifecycle.md) – Two-stage SSL certificate initialization, Let's Encrypt ACME renewal, and Nginx automated reload.
* [Client Synchronization & Build Workflow](./client_sync.md) – Procedures for synchronizing OpenAPI schemas, restarting PHP schema caches, and compiling Nuxt static assets.
* [Testing Execution Workflow](./testing.md) – Standard commands for running backend PHPUnit suites, Vitest component tests, and Playwright E2E suites.

---

## Related Nodes

* Back to [Main Knowledge Graph Index](../index.md)
