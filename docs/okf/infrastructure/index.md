---
type: index
title: Infrastructure & Containerization
description: Container topology, service dependencies, shared Unix socket IPC volumes, SSL management, and developer tooling profiles.
version: 0.2.0
status: active
---

# Infrastructure & Containerization

## Overview

The **MEDGREENREV** system is orchestrated via Docker Compose (`docker-compose.yml` and `docker-compose.prod.yml`). The runtime architecture relies on high-performance inter-process communication using shared Unix sockets for database, cache, and PHP-FPM connections.

---

## Topology & IPC Specifications

* [Unix Domain Socket IPC & Inter-Container Topology](./socket_ipc_topology.md) – Shared Unix socket volumes (`php_socket`, `pg_socket`, `redis_socket`), zero-TCP overhead design, and process-level security isolation.

---

## Service Specifications

* [PHP Service (`php`)](./php_service.md) – Symfony 7.x PHP 8.4-FPM container runtime and CLI console environment.
* [Nginx Service (`nginx`)](./nginx_service.md) – Reverse proxy, static Nuxt client host at `/app/`, media serving, and GeoServer routing.
* [Database Service (`database`)](./database_service.md) – PostgreSQL with PostGIS extension and automated backup tooling.
* [Redis Service (`redis`)](./redis_service.md) – Unix socket-based caching and asynchronous message broker.
* [GeoServer Service (`geoserver`)](./geoserver_service.md) – OGC WMS/WFS spatial data publishing backed by PostGIS JNDI pool.
* [Certbot SSL Service (`certbot`)](./certbot_service.md) – Automated Let's Encrypt certificate issuance, renewal scripts, and ACME challenge webroot mounting.
* [Node Tools Service (`node`)](./node_tools_service.md) – Node.js 22 container profile for Nuxt SPA development and static site generation.

---

## Related Nodes

* Back to [Main Knowledge Graph Index](../index.md)
