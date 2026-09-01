#!/usr/bin/env bash

set -u

GEOSERVER_BASE_URL="${GEOSERVER_BASE_URL:-http://localhost:8080/geoserver}"
GEOSERVER_WPS_URL="${GEOSERVER_WPS_URL:-http://localhost:8080/geoserver/wps?service=WPS&request=GetCapabilities}"

curl_status() {
  local url="$1"

  curl \
    --silent \
    --show-error \
    --location \
    --output /dev/null \
    --write-out "%{http_code}" \
    --max-time 15 \
    "$url"
}

base_status="$(curl_status "$GEOSERVER_BASE_URL" 2>&1)"
base_curl_exit=$?

if [ "$base_curl_exit" -ne 0 ]; then
  echo "GeoServer healthcheck failed: GeoServer base endpoint is not reachable at ${GEOSERVER_BASE_URL}."
  echo "curl output: ${base_status}"
  exit 1
fi

if [ "$base_status" -lt 200 ] || [ "$base_status" -ge 400 ]; then
  echo "GeoServer healthcheck failed: GeoServer base endpoint returned HTTP ${base_status} at ${GEOSERVER_BASE_URL}."
  exit 1
fi

wps_status="$(curl_status "$GEOSERVER_WPS_URL" 2>&1)"
wps_curl_exit=$?

if [ "$wps_curl_exit" -ne 0 ]; then
  echo "GeoServer healthcheck failed: WPS endpoint is not reachable at ${GEOSERVER_WPS_URL}."
  echo "GeoServer itself is reachable at ${GEOSERVER_BASE_URL}, so the WPS extension may be missing, disabled, or not fully initialized."
  echo "curl output: ${wps_status}"
  exit 1
fi

if [ "$wps_status" -eq 404 ]; then
  echo "GeoServer healthcheck failed: GeoServer is reachable, but WPS endpoint returned HTTP 404 at ${GEOSERVER_WPS_URL}."
  echo "The WPS extension is likely missing or failed to install during container startup."
  echo "Check 'docker compose logs geoserver' for WPS plugin download, ZIP validation, or unzip errors."
  exit 1
fi

if [ "$wps_status" -lt 200 ] || [ "$wps_status" -ge 400 ]; then
  echo "GeoServer healthcheck failed: WPS endpoint returned HTTP ${wps_status} at ${GEOSERVER_WPS_URL}."
  echo "GeoServer is reachable, but WPS is not healthy."
  exit 1
fi

echo "GeoServer healthcheck passed: WPS endpoint is available at ${GEOSERVER_WPS_URL}."
exit 0