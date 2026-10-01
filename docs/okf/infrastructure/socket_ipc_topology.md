---
type: infrastructure_service
title: Unix Domain Socket IPC & Inter-Container Topology
status: active
target_file: docker-compose.yml
---

# Unix Domain Socket IPC & Inter-Container Topology

## Architectural Role

MEDGREENREV replaces network TCP connections with shared Unix domain sockets for inter-container communication across core services. This architecture eliminates TCP network stack overhead, improves request throughput, and provides strong process-level security isolation.

---

## Socket IPC Topology Diagram

```
                     ┌────────────────────────┐
                     │         Nginx          │
                     │      (Web Server)      │
                     └───────────┬────────────┘
                                 │
                         (php_socket volume)
                      /var/run/php/php-fpm.sock
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │        PHP-FPM         │
                     │  (Symfony Application) │
                     └───────┬────────┬───────┘
                             │        │
           (pg_socket volume)│        │(redis_socket volume)
  /var/run/postgresql/.s.PGSQL.5432   │/var/run/redis/redis/redis.sock
                             │        │
                             ▼        ▼
       ┌────────────────────────┐  ┌────────────────────────┐
       │   PostgreSQL/PostGIS   │  │         Redis          │
       │       (Database)       │  │    (Cache & Queue)     │
       └────────────────────────┘  └────────────────────────┘
```

---

## Shared Named Volumes & Socket Specifications

### 1. `php_socket` (`/var/run/php`)
* **Producer (PHP):** PHP-FPM listens on `/var/run/php/php-fpm.sock` with permissions mode `0666` configured in [docker/php/php-fpm.d/zz-docker.conf](../../../docker/php/php-fpm.d/zz-docker.conf).
* **Consumer (Nginx):** Nginx mounts `php_socket:/var/run/php` and dispatches PHP requests via FastCGI over the socket (`fastcgi_pass unix:/var/run/php/php-fpm.sock;`).
* **Healthcheck:** Checked via `test -S /var/run/php/php-fpm.sock` in [docker-compose.yml](../../../docker-compose.yml).

### 2. `pg_socket` (`/var/run/postgresql`)
* **Producer (Database):** PostgreSQL daemon binds to standard Unix socket `/var/run/postgresql/.s.PGSQL.5432` within the `pg_socket` volume.
* **Consumer (PHP):** PHP container mounts `pg_socket:/var/run/postgresql`, allowing Doctrine DBAL and CLI commands to communicate directly with PostgreSQL without traversing Docker's virtual bridge network.

### 3. `redis_socket` (`/tmp/socket` $\leftrightarrow$ `/var/run/redis`)
* **Producer (Redis):** Configured in [docker/redis/redis.conf](../../../docker/redis/redis.conf) with:
  ```
  port 0
  unixsocket /tmp/socket/redis/redis.sock
  unixsocketperm 777
  ```
  Disables TCP network listening entirely (`port 0`), restricting Redis access exclusively to local Unix socket IPC.
* **Consumer (PHP):** PHP container mounts `redis_socket:/var/run/redis` to access Redis caching, session storage, and messenger transports.
* **Healthcheck:** Monitored via `redis-cli -s /tmp/socket/redis/redis.sock ping`.

---

## Architectural & Security Benefits

* **Performance:** Eliminates TCP packet framing, TCP checksum computation, loopback routing, and socket buffer copying, reducing CPU utilization and response latencies.
* **Attack Surface Reduction:** Disabling TCP ports (e.g. on Redis) ensures internal services cannot be probed or accessed across unauthorized networks or exposed by misconfigured firewall rules.
* **Zero TCP Port Conflicts:** Multiple application environments or test runner instances can run on the same host without port collision.

---

## Key Relationships

* **Compose Topology:** [docker-compose.yml](../../../docker-compose.yml)
* **PHP-FPM Socket Configuration:** [docker/php/php-fpm.d/zz-docker.conf](../../../docker/php/php-fpm.d/zz-docker.conf)
* **Redis Configuration:** [docker/redis/redis.conf](../../../docker/redis/redis.conf)
* **PHP Service Node:** [PHP-FPM Application Service](./php_service.md)
* **Nginx Service Node:** [Nginx Reverse Proxy & Static Server](./nginx_service.md)
* **Redis Service Node:** [Redis Cache Service](./redis_service.md)
* **Database Service Node:** [PostGIS Spatial Database Service](./database_service.md)

---

## Related Nodes

* Back to [Infrastructure Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
