---
type: infrastructure_service
title: PHP Application Service (Symfony API)
status: active
target_file: docker-compose.yml
service_name: php
---

# PHP Application Service (Symfony API)

## Architectural Role

The `php` container provides the PHP 8.4-FPM execution runtime for the Symfony 7.x REST API backend. It mounts shared Unix sockets (`php_socket`, `pg_socket`, `redis_socket`) to enable high-throughput, low-latency communication with Nginx, PostgreSQL, and Redis without TCP network overhead. It also serves as the execution environment for Symfony CLI commands, database migrations, and fixture loading.

## Runtime & Health Constraints

* **FastCGI Socket:** Listens on `/var/run/php/php-fpm.sock` (mounted from `php_socket`).
* **Dependencies:** Depends on healthy `database` and `redis` services before starting.
* **Healthcheck:** Validates the presence and readiness of the PHP-FPM Unix socket (`test -S /var/run/php/php-fpm.sock`).
* **Static Storage:** Mounts the application static directory for media and file import processing.

## Key Relationships

* **Declaration / Implementation:** [docker-compose.yml](../../../docker-compose.yml) (`services.php`)
* **Dockerfile Definition:** [docker/php/Dockerfile](../../../docker/php/Dockerfile)
* **API Application Source:** [api/](../../../api/)
* **Upstream Proxy:** [Nginx Reverse Proxy](./nginx_service.md)
* **Downstream Storage:** [PostGIS Database](./database_service.md) & [Redis Cache](./redis_service.md)

## Related Nodes

* Back to [Infrastructure Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
