---
type: infrastructure_service
title: GeoServer Geospatial Service
status: active
target_file: docker-compose.yml
service_name: geoserver
---

# GeoServer Geospatial Service

## Architectural Role

The `geoserver` container publishes spatial datasets and archaeological cartographic layers via standard Open Geospatial Consortium (OGC) protocols, including Web Map Service (WMS) and Web Feature Service (WFS). It connects directly to the PostGIS spatial database using a JNDI connection pool to render vector and raster layers consumed by the Nuxt OpenLayers frontend map.

## Runtime & Configuration Constraints

* **JNDI PostGIS Store:** Configured with `POSTGRES_JNDI_ENABLED=true` pointing to the `database` service.
* **Data Volume:** Persists GeoServer workspace and layer configuration in `docker/geoserver/data/`.
* **Healthcheck:** Periodically queries the GeoServer HTTP healthcheck endpoint.
* **Proxy Ingress:** Proxied through Nginx to ensure uniform domain access and SSL termination.

## Key Relationships

* **Declaration / Implementation:** [docker-compose.yml](../../../docker-compose.yml) (`services.geoserver`)
* **Dockerfile & Scripts:** [docker/geoserver/](../../../docker/geoserver/)
* **Operations Workflow:** [GeoServer Operations & Entity Integration Workflow](../workflows/geoserver_operations.md)
* **Backend GeoServer Architecture:** [GeoServer Integration & Spatial Architecture](../backend/geoserver.md)
* **Data Source:** [PostGIS Spatial Database](./database_service.md)
* **Frontend Consumer:** [Frontend Client Architecture](../frontend/client_architecture.md)

## Related Nodes

* Back to [Infrastructure Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
