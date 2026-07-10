#!/usr/bin/env bash
# db-backup.sh — Thin host wrapper that triggers the in-container backup script.
#
# The actual dump logic lives in docker/database/backup.sh, which is mounted
# into the database container at /usr/local/bin/backup.sh and uses the
# container's own POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB and
# POSTGRES_BACKUP_DIR environment variables (provided by docker-compose.yml).
#
# Output (on the host, via bind mount):
#   $POSTGRES_BACKUP_DIR/YYYY/mm/YYYYmmDDTHHMMSS.sql

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

QUIET=false
QUIET_FLAG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -q|--quiet)
      QUIET=true
      QUIET_FLAG="--quiet"
      shift
      ;;
    *)
      shift
      ;;
  esac
done

log() {
    local level="$1"
    local message="$2"
    # Always log to syslog
    logger -t db-backup "[${level}] ${message}"
    # Only echo to stdout if NOT in quiet mode
    if [ "$QUIET" = false ]; then
        if [ "$level" = "ERROR" ]; then
            echo "${level}: ${message}" >&2
        else
            echo "${message}"
        fi
    elif [ "$level" = "ERROR" ]; then
        echo "${level}: ${message}" >&2
    fi
}

if [ "$QUIET" = false ]; then
  log "INFO" "Starting database backup (running pg_dump inside the database container)..."
else
  log "INFO" "Starting database backup (quiet mode)..."
fi

if ! docker compose --project-directory "${PROJECT_ROOT}" exec -T database \
  sh /usr/local/bin/backup.sh ${QUIET_FLAG}; then
    log "ERROR" "Database backup failed."
    exit 1
fi

log "INFO" "Backup completed successfully."
