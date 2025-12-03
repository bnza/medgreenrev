#!/usr/bin/env -S node
/**
 * compare-query-params.ts — Step 3
 *
 * For each key in FILTERS_PATHS_MAP:
 *  - Build the list of client query parameter names by invoking each static
 *    filter's `addToQueryObject` with operands ['provided-value'] on an empty object.
 *  - Fetch OpenAPI and collect API-declared query parameter names for the same path.
 *  - Diff per path and print lines:
 *      - name present in API but not in client: prefixed with '-'
 *      - name present in BOTH: prefixed with '='
 *      - name present in client but not in API: prefixed with '+'
 *
 * Simplified approach:
 * - This script is intended to be executed with `tsx` (or another TS runner).
 * - We directly import the TS module `app/utils/consts/configs/filters/index.ts`
 *   via a file URL so no bundling step is needed.
 */

import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { stringify } from 'qs'
import dotenv from 'dotenv'

// @ts-expect-error Vue complains about import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// Helper to determine if a value is a plain object (best-effort)
const isObject = (v: unknown): v is Record<string, any> =>
  typeof v === 'object' && v !== null

type OpenAPISpec = {
  openapi?: string
  swagger?: string
  paths?: Record<
    string,
    {
      parameters?: Array<any>
      get?: { parameters?: Array<any> }
      post?: { parameters?: Array<any> }
      put?: { parameters?: Array<any> }
      patch?: { parameters?: Array<any> }
      delete?: { parameters?: Array<any> }
    }
  >
  components?: {
    parameters?: Record<string, any>
  }
}

const IGNORED_PARAM_NAMES = new Set([
  'page',
  'itemsPerPage',
  'search',
  'granted',
])

// ANSI color codes for terminal output
const COLOR = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
} as const

const resolveRef = (spec: OpenAPISpec, ref?: string) => {
  if (!ref || typeof ref !== 'string') return null
  if (!ref.startsWith('#/')) return null
  const parts = ref.slice(2).split('/')

  let cur: any = spec
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p]
    else return null
  }
  return cur
}

const collectPathQueryParamNames = (spec: OpenAPISpec, apiPath: string) => {
  const pathItem = spec.paths?.[apiPath]
  if (!pathItem) return [] as string[]
  // Gather parameters from path-level and GET operation (collection endpoints)
  const params: any[] = []
  if (Array.isArray(pathItem.parameters)) params.push(...pathItem.parameters)
  if (Array.isArray(pathItem.get?.parameters))
    params.push(...pathItem.get!.parameters)
  // Resolve $ref and normalize
  const resolved = params
    .map((p) => (p && '$ref' in p ? resolveRef(spec, p.$ref) : p))
    .filter(Boolean) as Array<{ in?: string; name?: string }>
  const names = resolved
    .filter((p) => p.in === 'query' && typeof p.name === 'string')
    .map((p) => p.name as string)
    .filter((n) => !IGNORED_PARAM_NAMES.has(n))
    .filter((n) => !n.startsWith('order'))
  // Dedupe and sort for stability
  return Array.from(new Set(names)).sort()
}

async function main() {
  // Load environment variables
  dotenv.config()
  // Directly import the TS module using a file URL.
  // Run this script with: `npx tsx bin/compare-query-params.ts`
  const filtersModulePath = path.resolve(
    projectRoot,
    'app/utils/consts/configs/filters/index.ts',
  )
  const filtersModuleUrl = pathToFileURL(filtersModulePath).href
  const mod = await import(filtersModuleUrl)
  const { FILTERS_PATHS_MAP } = mod as {
    FILTERS_PATHS_MAP: Record<string, any>
  }

  if (!FILTERS_PATHS_MAP) {
    console.error('Could not load FILTERS_PATHS_MAP export')
    process.exit(1)
  }

  // CLI: optional --path <API_PATH> (or --path=<API_PATH> or positional)
  const allPaths = Object.keys(FILTERS_PATHS_MAP)
  const argv = process.argv.slice(2)
  const hasHelp = argv.includes('-h') || argv.includes('--help')
  let onlyError = argv.includes('--only-error') || argv.includes('-E')

  let requestedPath: string | undefined
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '-h' || arg === '--help') continue
    if (arg === '--only-error' || arg === '-E') {
      onlyError = true
      continue
    }
    if (arg === '--path' || arg === '-p') {
      requestedPath = argv[i + 1]
      i++
      continue
    }
    if (arg.startsWith('--path=')) {
      requestedPath = arg.slice('--path='.length)
      continue
    }
    // First non-flag positional argument treated as path
    if (!arg.startsWith('-') && !requestedPath) {
      requestedPath = arg
    }
  }

  const printUsage = () => {
    console.log(
      'Usage: npx tsx bin/compare-query-params.ts [--path <API_PATH>] [--only-error|-E]',
    )
    console.log('       npx tsx bin/compare-query-params.ts <API_PATH>')
    console.log('\nCompare client vs API query parameters per path.')
    console.log('\nOptions:')
    console.log(
      '  --path, -p <API_PATH>    Compare only the specified API path',
    )
    console.log(
      '  --only-error, -E         Show only parameters present in client but not in API, and only for paths where such differences exist',
    )
    console.log('\nAvailable paths:')
    for (const p of allPaths.sort()) console.log('  ' + p)
  }

  if (hasHelp) {
    printUsage()
    process.exit(0)
  }

  if (requestedPath && !allPaths.includes(requestedPath)) {
    console.error(`Unknown path: ${requestedPath}`)
    console.error('Use --help to list available paths.')
    process.exit(1)
  }

  const entriesAll = Object.entries(FILTERS_PATHS_MAP)
  const entries = requestedPath
    ? entriesAll.filter(([p]) => p === requestedPath)
    : entriesAll
  if (entries.length === 0) {
    console.log('No entries found in FILTERS_PATHS_MAP')
    return
  }

  const clientFilters: Record<string, string[]> = {}

  for (const [apiPath, resourceDef] of entries) {
    clientFilters[apiPath] = []

    if (isObject(resourceDef)) {
      for (const [property, def] of Object.entries(resourceDef)) {
        const filters =
          isObject(def) && isObject(def.filters) ? def.filters : {}
        for (const [key, filterDef] of Object.entries(filters)) {
          if (
            isObject(filterDef) &&
            typeof (filterDef as any).addToQueryObject === 'function'
          ) {
            // Build the query object by applying each filter with a placeholder operand
            const queryObject: Record<string, any> = {}
            try {
              ;(filterDef as any).addToQueryObject(queryObject, {
                property,
                key,
                operands: ['provided-value'],
              })
              clientFilters[apiPath].push(
                stringify(queryObject, {
                  encode: false,
                  arrayFormat: 'brackets',
                }).split('=')[0],
              )
            } catch (e) {
              // Keep going if a particular filter application fails
              console.warn(
                `[compare-query-params] Warning: failed to add filter ${String(
                  key,
                )} on property ${property}:`,
                (e as Error)?.message ?? e,
              )
            }
          }
        }
      }
    }
  }

  // Dedupe and sort client param names for stability
  for (const p of Object.keys(clientFilters)) {
    clientFilters[p] = Array.from(new Set(clientFilters[p])).sort()
  }

  // Step 2a: download API specs
  const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL
  if (!apiBaseUrl) {
    console.error('NUXT_PUBLIC_API_BASE_URL is not defined in your .env file.')
    process.exit(1)
  }
  const schemaUrl = `${apiBaseUrl}/api/docs.jsonopenapi`
  const response = await fetch(schemaUrl)
  if (!response.ok) {
    console.error(
      `Failed to fetch OpenAPI spec: ${response.status} ${response.statusText}`,
    )
    process.exit(1)
  }
  const openApiSpec = (await response.json()) as OpenAPISpec

  // Step 2b/2c: build apiFilters for each client path, filtering ignored names
  const apiFilters: Record<string, string[]> = {}
  for (const apiPath of Object.keys(clientFilters)) {
    apiFilters[apiPath] = collectPathQueryParamNames(openApiSpec, apiPath)
  }

  // Step 3: Diff per path and print colored lines
  const paths = Object.keys(clientFilters).sort()

  if (!onlyError) {
    console.log(
      `${COLOR.yellow} Present in API but not in client${COLOR.reset}`,
    )
    console.log(`${COLOR.green} Present in both${COLOR.reset}`)
    console.log(`${COLOR.red} Present in client but not in API${COLOR.reset}`)
  }
  const summary: [number, number] = [0, 0] // [onlyApiCount, onliClientCount]
  for (const apiPath of paths) {
    const client = new Set(clientFilters[apiPath] ?? [])
    const api = new Set(apiFilters[apiPath] ?? [])

    const onlyApi = Array.from(api)
      .filter((n) => !client.has(n))
      .sort()
    const both = Array.from(client)
      .filter((n) => api.has(n))
      .sort()
    const onlyClient = Array.from(client)
      .filter((n) => !api.has(n))
      .sort()

    if (onlyApi.length > 0) ++summary[0]
    if (onlyClient.length > 0) ++summary[1]

    // If onlyError flag is set, skip paths without client-only differences
    if (onlyError && onlyClient.length === 0) continue

    console.log(`\n=== ${apiPath} ===`)
    if (onlyError) {
      for (const name of onlyClient)
        console.log(`${COLOR.red}${name}${COLOR.reset}`)
    } else {
      for (const name of onlyApi)
        console.log(`${COLOR.yellow}${name}${COLOR.reset}`)
      for (const name of both)
        console.log(`${COLOR.green}${name}${COLOR.reset}`)
      for (const name of onlyClient)
        console.log(`${COLOR.red}${name}${COLOR.reset}`)
    }
  }

  console.log(`\n${paths.length} API paths checked.`)
  if (summary[0] || summary[1]) {
    console.log(`Found issues:`)
    console.log(
      `${COLOR.yellow}${summary[0]}${COLOR.reset} path with missing client correspondence`,
    )
    console.log(
      `${COLOR.red}${summary[1]}${COLOR.reset} path with missing API correspondence`,
    )
  } else {
    console.log(`No issues found`)
  }
}

// Execute only when run directly
// @ts-expect-error Vue complains about import.meta.url
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('[compare-query-params] Error:', err)
    process.exit(1)
  })
}
