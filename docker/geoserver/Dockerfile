ARG GEOSERVER_VERSION=3.0.2
FROM docker.osgeo.org/geoserver:${GEOSERVER_VERSION}

COPY init.sh /opt/init.sh
COPY healthcheck.sh /opt/healthcheck.sh
RUN chmod +x /opt/init.sh /opt/healthcheck.sh

ENTRYPOINT ["bash", "/opt/init.sh"]
