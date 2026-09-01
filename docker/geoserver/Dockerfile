ARG GEOSERVER_VERSION=2.28.1
FROM docker.osgeo.org/geoserver:${GEOSERVER_VERSION}

COPY init.sh /opt/init.sh
COPY healthcheck.sh /opt/healthcheck.sh
RUN chmod +x /opt/init.sh /opt/healthcheck.sh

ENTRYPOINT ["bash", "/opt/init.sh"]
