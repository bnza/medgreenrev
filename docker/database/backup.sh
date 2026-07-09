#!/bin/sh
# backup.sh — Runs INSIDE the database container.
# Uses the standard PostgreSQL env vars already provided by the image:
#   POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_BACKUP_DIR
# Produces a plain-SQL dump compatible with /docker-entrypoint-initdb.d/
# at: $POSTGRES_BACKUP_DIR/YYYY/MM/<ISO-datetime>.sql

set -eu

: "${POSTGRES_USER:?POSTGRES_USER not set in container}"
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD not set in container}"
: "${POSTGRES_DB:?POSTGRES_DB not set in container}"
: "${POSTGRES_BACKUP_DIR:?POSTGRES_BACKUP_DIR not set in container}"

QUIET=false

while [ $# -gt 0 ]; do
  case "$1" in
    -q|--quiet)
      QUIET=true
      shift
      ;;
    *)
      shift
      ;;
  esac
done

YEAR="$(date +%Y)"
MONTH="$(date +%m)"
ISO_DATETIME="$(date +%Y%m%dT%H%M%S)"

DEST_DIR="${POSTGRES_BACKUP_DIR}/${YEAR}/${MONTH}"
DEST_FILE="${DEST_DIR}/${ISO_DATETIME}.sql.gz"

mkdir -p "${DEST_DIR}"

if [ "$QUIET" = false ]; then
  echo "Dumping database '${POSTGRES_DB}' as user '${POSTGRES_USER}' to ${DEST_FILE}"
fi

PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
  --format=plain \
  --no-owner \
  --no-acl \
  --encoding=UTF8 \
  -U "${POSTGRES_USER}" \
  "${POSTGRES_DB}" \
  | gzip -9 > "${DEST_FILE}"

if [ "$QUIET" = false ]; then
  echo "Backup completed: ${DEST_FILE}"
fi
