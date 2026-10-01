---
type: infrastructure_service
title: PostGIS Spatial Database Service
status: active
target_file: docker-compose.yml
service_name: database
---

# PostGIS Spatial Database Service

## Architectural Role

The `database` container runs PostgreSQL with the PostGIS extension, providing relational and spatial data persistence for MEDGREENREV. It manages multi-schema datasets (`Auth`, `Data`, `Vocabulary`), spatial geometries (points, polygons, microstratigraphic units, archaeological sites), and database views consumed by both the Symfony API and GeoServer.

## Runtime & Health Constraints

* **Unix Socket Communication:** Exposes `/var/run/postgresql` via the `pg_socket` volume for PHP-FPM access.
* **TCP Port:** Exposes internal port 5432 for GeoServer JNDI connections.
* **Healthcheck:** Evaluates readiness via `pg_isready` using configured database credentials.
* **Backup Management:** Includes automated database backup scripting mounted at `/usr/local/bin/backup.sh`.

## Key Relationships

* **Declaration / Implementation:** [docker-compose.yml](../../../docker-compose.yml) (`services.database`)
* **Initialization Scripts:** [docker/database/](../../../docker/database/)
* **Database Architecture Specification:** [Database Architecture & Policies](../backend/database.md)
* **Consumers:** [PHP Service](./php_service.md) and [GeoServer Service](./geoserver_service.md).

## Related Nodes

* Back to [Infrastructure Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
