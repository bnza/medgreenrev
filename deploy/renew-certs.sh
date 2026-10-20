#!/usr/bin/env bash
# renew-certs.sh — Host wrapper: renew the Let's Encrypt certificate, reload nginx, log everything.
#
# Designed for cron (run weekly). certbot only renews when < 30 days remain
# (--keep-until-expiring), so running weekly is safe and gives ~4 retries before expiry.
#
# Crontab example (replaces the old monthly entry):
#   0 3 * * 1 /mnt/data/medgreenrev/deploy/renew-certs.sh
#
# Log: $LOG_FILE (default: <project>/docker/certbot/logs/certbot-renew.log), rotated at 1 MB.
# Exit code: 0 on success, non-zero on failure.

set -uo pipefail

export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:${PATH:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$PROJECT_ROOT" || exit 1

LOG_FILE="${LOG_FILE:-${PROJECT_ROOT}/docker/certbot/logs/certbot-renew.log}"
mkdir -p "$(dirname "$LOG_FILE")"
if [ -f "$LOG_FILE" ] && [ "$(stat -c %s "$LOG_FILE")" -gt 1048576 ]; then
  mv -f "$LOG_FILE" "${LOG_FILE}.1"
fi

log() { printf '%s [%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S%z')" "$1" "$2" >> "$LOG_FILE"; }

# Load .env (NGINX_HOST etc.) for the expiry report
NGINX_HOST_VALUE=""
if [ -f .env ]; then
  NGINX_HOST_VALUE="$(grep -E '^NGINX_HOST=' .env | tail -n1 | cut -d= -f2- | tr -d '"'"'" || true)"
fi

cert_expiry() {
  local pem="docker/certbot/conf/live/${NGINX_HOST_VALUE}/fullchain.pem"
  [ -n "$NGINX_HOST_VALUE" ] && [ -f "$pem" ] && openssl x509 -enddate -noout -in "$pem" 2>/dev/null | cut -d= -f2
}

# Run a command, append its output to the log with a prefix, return its status
run_logged() {
  local desc="$1"; shift
  log INFO "START: ${desc}"
  local out rc
  out="$("$@" 2>&1 < /dev/null)"; rc=$?
  [ -n "$out" ] && printf '%s\n' "$out" | sed 's/^/    | /' >> "$LOG_FILE"
  if [ $rc -eq 0 ]; then log INFO "OK: ${desc}"; else log ERROR "FAILED (exit ${rc}): ${desc}"; fi
  return $rc
}

log INFO "===== Certificate renewal started (host: $(hostname)) ====="
BEFORE="$(cert_expiry || true)"
log INFO "Certificate expiry before: ${BEFORE:-unknown}"

# -T: no TTY allocation (required under cron, otherwise "the input device is not a TTY")
if ! run_logged "certbot renew" docker compose run --rm -T certbot /opt/certbot-scripts/renew-certs.sh; then
  log ERROR "===== Renewal FAILED — certificate NOT renewed ====="
  exit 1
fi

AFTER="$(cert_expiry || true)"
log INFO "Certificate expiry after: ${AFTER:-unknown}"

if [ "$BEFORE" = "$AFTER" ] && [ -n "$BEFORE" ]; then
  log INFO "Certificate unchanged (not yet due for renewal); reloading nginx anyway is harmless"
else
  log INFO "Certificate was renewed"
fi

if ! run_logged "nginx reload" docker compose exec -T nginx nginx -s reload; then
  log ERROR "===== nginx reload FAILED — new certificate may not be served ====="
  exit 2
fi

log INFO "===== Renewal finished successfully ====="
