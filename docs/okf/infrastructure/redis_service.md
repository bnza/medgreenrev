---
type: infrastructure_service
title: Redis Cache & Broker Service
status: active
target_file: docker-compose.yml
service_name: redis
---

# Redis Cache & Broker Service

## Architectural Role

The `redis` container provides in-memory key-value storage used by the Symfony backend for doctrine metadata caching, API response caching, and session or asynchronous message brokering. To ensure optimal performance and security, Redis communicates exclusively over a shared Unix domain socket.

## Runtime & Health Constraints

* **Socket-Only Configuration:** Binds to `/tmp/socket/redis/redis.sock` mounted on the `redis_socket` volume, eliminating TCP overhead.
* **Healthcheck:** Executes `redis-cli -s /tmp/socket/redis/redis.sock ping` to verify responsiveness.

## Key Relationships

* **Declaration / Implementation:** [docker-compose.yml](../../../docker-compose.yml) (`services.redis`)
* **Configuration & Dockerfile:** [docker/redis/](../../../docker/redis/)
* **Primary Consumer:** [PHP Service](./php_service.md)

## Related Nodes

* Back to [Infrastructure Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
