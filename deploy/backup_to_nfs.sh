#!/usr/bin/env bash
# backup_to_nfs.sh
# Backup script for growth-only data (DB dumps & hashed statics) to an NFS share.
# Designed to be run as UID:GID 45627:2014 (Option A).

set -euo pipefail

# --- Configuration ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

usage() {
    echo "Usage: $0 [options] <subfolder>"
    echo "  -q, --quiet:             Suppress stdout output (errors still go to stderr)"
    echo "  -m, --mount-point=PATH:  Base where the NFS share is mounted (default: /mnt/backup)"
    echo "  subfolder:               Mandatory. The subfolder within the mount point where data will be stored"
    exit 1
}

# Default values
NFS_MOUNT_POINT="/mnt/backup"
SUBFOLDER=""
QUIET=false

# --- Argument Parsing ---
# We need to handle flags and positional arguments
POSITIONAL_ARGS=()

while [[ $# -gt 0 ]]; do
    case "$1" in
        -q|--quiet)
            QUIET=true
            shift
            ;;
        -m|--mount-point)
            if [[ -n "${2:-}" && "$2" != -* ]]; then
                NFS_MOUNT_POINT="$2"
                shift 2
            else
                log "ERROR" "Option $1 requires a non-empty argument."
                usage
            fi
            ;;
        --mount-point=*)
            NFS_MOUNT_POINT="${1#*=}"
            shift
            ;;
        -*)
            echo "Unknown option $1"
            usage
            ;;
        *)
            POSITIONAL_ARGS+=("$1")
            shift
            ;;
    esac
done

# Restore positional parameters
set -- "${POSITIONAL_ARGS[@]}"

if [ ${#POSITIONAL_ARGS[@]} -eq 1 ]; then
    SUBFOLDER="${POSITIONAL_ARGS[0]}"
else
    usage
fi

if [ -z "${SUBFOLDER}" ]; then
    log "ERROR" "subfolder is mandatory."
    usage
fi

BACKUP_DEST="${NFS_MOUNT_POINT}/${SUBFOLDER}"

# Helper function for logging
log() {
    local level="$1"
    local message="$2"
    local priority="user.info"

    [ "$level" = "ERROR" ] && priority="user.err"
    [ "$level" = "WARNING" ] && priority="user.warning"

    # Always log to syslog
    logger -t backup_to_nfs "[${level}] ${message}"

    # Output to terminal if not quiet
    if [ "$QUIET" = false ]; then
        if [ "$level" = "ERROR" ]; then
            echo "${level}: ${message}" >&2
        else
            echo "${message}"
        fi
    elif [ "$level" = "ERROR" ]; then
        # In quiet mode, only errors go to stderr
        echo "${level}: ${message}" >&2
    fi
}

# Load source paths from the root .env
if [ -f "${PROJECT_ROOT}/.env" ]; then
    # Extract variables while ignoring comments and empty lines
    POSTGRES_BACKUP_DIR=$(grep '^POSTGRES_BACKUP_DIR=' "${PROJECT_ROOT}/.env" | cut -d '=' -f2)
    WWW_STATIC_DIR=$(grep '^WWW_STATIC_DIR=' "${PROJECT_ROOT}/.env" | cut -d '=' -f2)
else
    log "ERROR" "Root .env file not found at ${PROJECT_ROOT}/.env"
    exit 1
fi

# Configuration files to backup
CONFIG_FILES=(
    ".env"
    "api/.env.local.prod"
)

# --- Logic ---

log "INFO" "--- Starting Backup ---"

# 1. Check if NFS mount is available (or at least a directory for testing) and writable
if ! mountpoint -q "${NFS_MOUNT_POINT}"; then
    if [ -d "${NFS_MOUNT_POINT}" ]; then
        log "WARNING" "${NFS_MOUNT_POINT} is not a mountpoint but is a directory. Proceeding (Testing mode)."
    else
        log "ERROR" "${NFS_MOUNT_POINT} is not a mountpoint or directory. Aborting."
        exit 1
    fi
fi

if [ ! -w "${BACKUP_DEST}" ] && [ ! -w "${NFS_MOUNT_POINT}" ]; then
    log "ERROR" "Backup destination ${BACKUP_DEST} is not writable by current user $(id -u)."
    exit 1
fi

mkdir -p "${BACKUP_DEST}/config"

# Prepare rsync flags
RSYNC_OPTS="-a"
[ "$QUIET" = false ] && RSYNC_OPTS="${RSYNC_OPTS}v"

# 2. Sync Database Backups (Growing)
if [ -n "${POSTGRES_BACKUP_DIR}" ] && [ -d "${POSTGRES_BACKUP_DIR}" ]; then
    log "INFO" "Syncing database dumps from ${POSTGRES_BACKUP_DIR}..."
    rsync ${RSYNC_OPTS} "${POSTGRES_BACKUP_DIR}/" "${BACKUP_DEST}/db_backups/"
else
    log "WARNING" "POSTGRES_BACKUP_DIR not found or not a directory."
fi

# 3. Sync Static Files (Growing)
if [ -n "${WWW_STATIC_DIR}" ] && [ -d "${WWW_STATIC_DIR}" ]; then
    log "INFO" "Syncing static files from ${WWW_STATIC_DIR}..."
    rsync ${RSYNC_OPTS} "${WWW_STATIC_DIR}/" "${BACKUP_DEST}/static/"
else
    log "WARNING" "WWW_STATIC_DIR not found or not a directory."
fi

# 4. Sync Configuration Files (Incremental on change)
log "INFO" "Syncing configuration files..."
TIMESTAMP="$(date +%Y%m%dT%H%M%S)"

for cfg in "${CONFIG_FILES[@]}"; do
    SRC_FILE="${PROJECT_ROOT}/${cfg}"
    if [ -f "${SRC_FILE}" ]; then
        BASE_NAME="$(basename "${cfg}")"
        DEST_DIR="${BACKUP_DEST}/config"

        # Find the most recent backup of this file
        # We look for files starting with BASE_NAME followed by a dot and timestamp
        LAST_BACKUP=$(ls -1 "${DEST_DIR}/${BASE_NAME}."* 2>/dev/null | sort | tail -n 1 || true)

        SHOULD_COPY=false
        if [ -z "${LAST_BACKUP}" ]; then
            SHOULD_COPY=true
            log "INFO" "No previous backup for ${BASE_NAME}, creating first one."
        elif ! cmp -s "${SRC_FILE}" "${LAST_BACKUP}"; then
            SHOULD_COPY=true
            log "INFO" "Config file ${BASE_NAME} has changed, creating new backup."
        fi

        if [ "$SHOULD_COPY" = true ]; then
            DEST_FILE="${DEST_DIR}/${BASE_NAME}.${TIMESTAMP}"
            if [ "$QUIET" = false ]; then
                cp -v "${SRC_FILE}" "${DEST_FILE}"
            else
                cp "${SRC_FILE}" "${DEST_FILE}"
            fi
        else
            log "INFO" "Config file ${BASE_NAME} has not changed, skipping."
        fi
    else
        log "INFO" "Config file ${cfg} not found, skipping."
    fi
done

log "INFO" "--- Backup Completed Successfully ---"
