FROM node:22-alpine

ARG USER_UID=1000
ARG USER_GID=1000

RUN npm install -g pnpm@10

# The node image already provides a `node` user (UID 1000, GID 1000).
# If a different UID/GID is requested, adjust the existing user to match the host.
RUN if [ "${USER_GID}" != "1000" ]; then delgroup node && addgroup -g ${USER_GID} node; fi && \
    if [ "${USER_UID}" != "1000" ]; then deluser node && adduser -u ${USER_UID} -G node -s /bin/sh -D node; fi

USER node

WORKDIR /srv/client
