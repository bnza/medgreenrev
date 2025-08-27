import type { Iri } from '~~/types'
import { sha256 } from 'js-sha256'

export * from './validation'
export * from './guards'

export const isAppPathItemPage = (path: string): boolean => {
  // General UUID pattern (accepts any version)
  const uuidPattern =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  // Digits pattern
  const digitsPattern = /\d+$/

  return digitsPattern.test(path) || uuidPattern.test(path)
}

export const extractIdFromIri = (iri: Iri) => {
  const parts = iri.split('/')
  const id = parts[parts.length - 1]
  if (!id) {
    throw new Error(`Invalid IRI: ${iri}`)
  }
  return id
}

/**
 * Replaces a SHA256-based IRI with a numeric ID-based IRI
 * @param value - Object with @id (IRI) and id (string|number) properties, or undefined
 * @returns New IRI with numeric ID, or undefined if input is undefined
 */
export function replaceSha256IriWithNumericId(
  value:
    | {
        '@id'?: string | undefined
        id?: string | number | undefined
      }
    | undefined,
): string | undefined {
  if (!value || !value['@id'] || value.id === undefined || value.id === null) {
    return undefined
  }

  const currentIri = value['@id']
  const numericId = value.id

  // Split the IRI and replace the last segment (SHA256) with the numeric ID
  const iriParts = currentIri.split('/')
  if (iriParts.length === 0) {
    throw new Error(`Invalid IRI format: ${currentIri}`)
  }

  // Replace the last part (SHA256 hash) with the numeric ID
  iriParts[iriParts.length - 1] = String(numericId)

  return iriParts.join('/')
}

export const isTemplatePathItemPage = (path: string): boolean => {
  const templatePattern = /\{[a-zA-Z]+}$/
  return templatePattern.test(path)
}

export async function calculateSHA256FileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  return sha256(uint8Array)
}

/**
 * Parses a size value with optional suffix (K, M, G) and converts it to bytes
 * @param input - Size value as string (e.g., "10M", "512K") or number
 * @returns Size in bytes as a number
 * @throws Error if the input format is invalid
 */
export function parseBitSize(input: string | number): number {
  if (typeof input === 'number') {
    return input
  }

  if (typeof input !== 'string' || input.trim() === '') {
    throw new Error('Invalid input: must be a non-empty string or number')
  }

  const trimmed = input.trim()
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*([KMGkmg]?)$/)

  if (!match || !match[1]) {
    throw new Error(`Invalid size format: ${input}`)
  }

  const numberPart = match[1] // Use array access instead of destructuring
  const suffix = match[2] || ''

  let size = parseFloat(numberPart)

  if (isNaN(size) || size < 0) {
    throw new Error(`Invalid number: ${numberPart}`)
  }

  if (suffix === 'K' || suffix === 'k') {
    size *= 1024 // Kilobytes are 1024 bytes
  } else if (suffix === 'M' || suffix === 'm') {
    size *= 1048576 // Megabytes are 1024*1024 = 1,048,576 bytes
  } else if (suffix === 'G' || suffix === 'g') {
    size *= 1073741824 // Gigabytes are 1024³ bytes
  }

  return Math.floor(size)
}

/**
 * Converts bytes to a human-readable size string with appropriate suffix (B, K, M, G)
 * @param bytes - Size in bytes as number or undefined
 * @returns Human-readable size string (e.g., "10M", "512K", "2G") or undefined if input is undefined
 */
export function formatBitSize(bytes: number | undefined): string | undefined {
  if (bytes === undefined) {
    return undefined
  }

  if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
    throw new Error(
      `Invalid input: must be a non-negative number, got ${bytes}`,
    )
  }

  // Handle zero bytes
  if (bytes === 0) {
    return '0'
  }

  // Define thresholds (using binary prefixes like parseBitSize)
  const GB = 1073741824 // 1024³
  const MB = 1048576 // 1024²
  const KB = 1024 // 1024

  // Convert to appropriate unit
  if (bytes >= GB && bytes % GB === 0) {
    return `${bytes / GB}G`
  } else if (bytes >= MB && bytes % MB === 0) {
    return `${bytes / MB}M`
  } else if (bytes >= KB && bytes % KB === 0) {
    return `${bytes / KB}K`
  } else if (bytes >= GB) {
    const gb = bytes / GB
    return `${gb % 1 === 0 ? gb : gb.toFixed(1)}G`
  } else if (bytes >= MB) {
    const mb = bytes / MB
    return `${mb % 1 === 0 ? mb : mb.toFixed(1)}M`
  } else if (bytes >= KB) {
    const kb = bytes / KB
    return `${kb % 1 === 0 ? kb : kb.toFixed(1)}K`
  } else {
    return `${bytes}`
  }
}
