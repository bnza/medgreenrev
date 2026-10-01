---
type: infrastructure_service
title: Nginx Web Server & Reverse Proxy
status: active
target_file: docker-compose.yml
service_name: nginx
---

# Nginx Web Server & Reverse Proxy

## Architectural Role

The `nginx` container serves as the primary ingress point and reverse proxy for the entire MEDGREENREV application. It routes incoming HTTP/HTTPS traffic to the appropriate backend service, serves the compiled Nuxt 4 Single-Page Application (SPA) statically at the `/app/` URL prefix, exposes media files from static volumes, and terminates SSL with Certbot support.

## Routing Architecture

* **Client SPA Route (`/app/`):** Serves pre-rendered Nuxt static assets from the client build output volume.
* **API Endpoints (`/api/`):** Proxies FastCGI requests directly to the `php` container via `php_socket`.
* **GeoServer Proxy:** Proxies OGC WMS/WFS geospatial layer requests to the `geoserver` container.
* **Static Media:** Directly delivers uploaded and imported media assets from the shared static directory.
* **SSL / ACME:** Serves ACME challenge tokens from Certbot for Let's Encrypt certificate renewal.

## Key Relationships

* **Declaration / Implementation:** [docker-compose.yml](../../../docker-compose.yml) (`services.nginx`)
* **Configuration Templates:** [docker/nginx/](../../../docker/nginx/)
* **Upstream Consumers:** Web browsers and GIS client software.
* **Downstream Handlers:** [PHP Service](./php_service.md), [GeoServer Service](./geoserver_service.md), and [Frontend Client Architecture](../frontend/client_architecture.md).

## Related Nodes

* Back to [Infrastructure Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
