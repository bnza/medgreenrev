## Deployment

### Database

Deploy database container

```shell
docker compose up database
```

### PHP

Build and deploy PHP container

```shell
docker compose build php
```

### Environment variables

Copy root directory ```.env.dist``` to ```.env``` and fill in the correct information.

#### Secret

Generate the ```APP_SECRET``` (with e.g. [coderstoolbox](https://coderstoolbox.online/toolbox/generate-symfony-secret))
and set it in ```api/.env.prod.local```

```dotenv
APP_SECRET=mysecret
```

#### Trusted hosts

The `TRUSTED_HOSTS` variable is a Symfony security setting that prevents HTTP Host header attacks by defining which
hostnames the application is allowed to respond to.

Set `TRUSTED_HOSTS` in `api/.env.prod.local`

```dotenv
TRUSTED_HOSTS=app.example.com,admin.example.com
```

#### CORS

The `CORS_ALLOW_ORIGIN` variable defines which external domains (typically your frontend application) are permitted to
make cross-origin requests to this API.

Set `CORS_ALLOW_ORIGIN` in `api/.env.prod.local`

```dotenv
CORS_ALLOW_ORIGIN=https://app.example.com,https://admin.example.com
```

#### JWT

```
JWT_PASSPHRASE=!ChangeMe!
```

this should be the content of the file ```.env.prod.local``````

 ```dotenv
JWT_PASSPHRASE=198a6c0953bbe8a941dbf3fcee2bda361ab6214ca286033e0ab8ff47a69eca11
APP_SECRET=aa60525074e80354602e3ffcaa1111c3
DATABASE_URL="postgresql://app:!secret!@127.0.0.1:5432/app?serverVersion=17&charset=utf8"
TRUSTED_HOSTS='^app\.example\.com'
CORS_ALLOW_ORIGIN='^https?://app\.example\.com(:[0-9]+)?$
```

#### Install composer dependencies and generate JWT key pairs

```shell
docker compose run --rm php bin/console lexik:jwt:generate-keypair
```

### GeoServer

The GeoServer configuration (workspaces, datastores, styles, layer definitions, security config) is tracked in the
repository under `docker/geoserver/data/`. This allows configuration changes made in development to be deployed to
production via `git pull`.

However, certain security-sensitive files **must not** be committed to a public repository:

- `security/masterpw/default/passwd` — encrypted master password
- `security/geoserver.jceks` — Java keystore
- `security/masterpw.digest` — master password digest
- `security/usergroup/default/users.xml` — user accounts with hashed passwords

These files are listed in `docker/geoserver/data/.gitignore` and are therefore **missing** after a fresh
`git clone` on a new environment. Without them, GeoServer's `GeoServerSecurityManager` throws a
`FileNotFoundException` during startup, causing the webapp to fail while Tomcat keeps running (resulting in a 404).

To solve this, a custom `Dockerfile` (`docker/geoserver/Dockerfile`) extends the official GeoServer image with an
init entrypoint script (`docker/geoserver/init.sh`). This script runs **before** GeoServer starts and:

1. Sets the `proxyBaseUrl` in `global.xml` from the `NGINX_HOST` environment variable, using `https` for
   production (`APP_ENV=prod`) and `http` for development.
2. Checks if the bind-mounted data directory has a `security/` folder (i.e. tracked config exists).
3. If `masterpw/default/passwd` is missing, copies it from the image's bundled defaults.
4. If `usergroup/default/users.xml` is missing, copies it from the image's bundled defaults.
5. GeoServer then auto-generates `geoserver.jceks` and `masterpw.digest` on first startup.
6. On **first start** (when `users.xml` was just created from defaults), delegates to the original
   `/opt/startup.sh` with `GEOSERVER_ADMIN_USER` and `GEOSERVER_ADMIN_PASSWORD` env vars intact.
   The startup chain (`handle_geoserver_admin_credentials.sh` → `update_credentials.sh`) hashes the
   password and writes it into `users.xml` and `roles.xml`.
7. On **subsequent starts** (when `users.xml` already exists), the script **unsets**
   `GEOSERVER_ADMIN_USER` and `GEOSERVER_ADMIN_PASSWORD` before delegating to `/opt/startup.sh`.
   This prevents the official image's credential update script from overwriting `users.xml` on every
   startup, which would trigger an unnecessary GeoServer webapp reload cycle (causing harmless but
   noisy warnings in the logs).

#### Deployment steps

1. In the docker `.env` file, set `USER_UID` and `USER_GID` to your host user's id and group id
   (used by `RUN_WITH_USER_UID`/`RUN_WITH_USER_GID` so GeoServer can write to the bind-mounted data directory):

```dotenv
USER_UID=1000
USER_GID=1000
```

2. Set the desired GeoServer admin credentials in `.env`:

```dotenv
GEOSERVER_ADMIN_USER=admin
GEOSERVER_ADMIN_PASSWORD=your_secure_password
```

These variables are only used on **first start** to set up the admin account. On subsequent
restarts they are ignored (see above). You can keep them in `.env` for reference.

3. Build and start the GeoServer container:

```shell
docker compose build geoserver
docker compose up geoserver
```

On first start the init script will generate the missing security files and the startup chain will
hash the admin password into `users.xml`. Subsequent restarts reuse the existing files without
triggering a webapp reload.

#### Changing the admin password

Because the init script skips credential updates when `users.xml` already exists, changing
`GEOSERVER_ADMIN_PASSWORD` in `.env` alone has no effect. To apply new credentials:

1. Update `GEOSERVER_ADMIN_USER` and/or `GEOSERVER_ADMIN_PASSWORD` in `.env`.
2. Delete the existing `users.xml` so the init script treats the next start as a first start:

   ```shell
   rm docker/geoserver/data/security/usergroup/default/users.xml
   ```

3. Restart the container:

   ```shell
   docker compose restart geoserver
   ```

### OpenAPI static spec

To improve client startup performance, the PHP container automatically generates a static OpenAPI spec file
(`public/docs.jsonopenapi`) at every container start. This avoids the costly dynamic generation of the full OpenAPI
specification (~2 MB) on each request.

The file is served directly by Nginx as a static asset at `/docs.jsonopenapi`, bypassing PHP entirely.

**Development note:** In the dev Nginx template, a dedicated `location` block adds CORS headers for this endpoint.
This is only needed when the Vue dev server (e.g. `localhost:5173`) makes cross-origin requests to the API server.
The production client served via `/app/` is same-origin and doesn't need it.

The generated file is excluded from version control via `api/.gitignore`.

### Web Server

Deploy web server container

```shell
docker compose up nginx
```

### Final steps

Once all the containers are set up and running, you can stop them and restart detached:

```shell
docker compose down
docker compose up -d
```