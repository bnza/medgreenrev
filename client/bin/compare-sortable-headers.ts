#!/usr/bin/env -S node
/**
 * compare-sortable-headers.ts
 *
 * For each resource config under `app/utils/consts/configs/data/*.ts`:
 *  - Collect `defaultHeaders[].key` values where `sortable !== false`.
 *  - Fetch the OpenAPI spec and collect `order[<key>]` query parameter names
 *    declared on the collection GET endpoint (`config.apiPath`).
 *  - Diff per path and print colored lines:
 *      - yellow: name present in API (`order[...]`) but not in client headers
 *      - green:  name present in BOTH
 *      - red:    name present in client headers but no `order[...]` in API
 *
 * Run with:
 *   docker compose run --rm node npx tsx bin/compare-sortable-headers.ts
 */
// @ts-expect-error path import
import path from 'node:path'
// @ts-expect-error node:fs has no bundled type stubs in this tsx context
import fs from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
// @ts-expect-error dotenv default import
import dotenv from 'dotenv'
// @ts-expect-error import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const isObject = (v: unknown): v is Record<string, any> =>
  typeof v === 'object' && v !== null
type OpenAPISpec = {
  paths?: Record<
    string,
    {
      parameters?: Array<any>
      get?: { parameters?: Array<any> }
    }
  >
  components?: {
    parameters?: Record<string, any>
  }
}
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
// Extract the inner key from `order[<key>]` query parameters declared for the
// path-level + GET operation of `apiPath`.
const collectOrderParamKeys = (spec: OpenAPISpec, apiPath: string) => {
  const pathItem = spec.paths?.[apiPath]
  if (!pathItem) return [] as string[]
  const params: any[] = []
  if (Array.isArray(pathItem.parameters)) params.push(...pathItem.parameters)
  if (Array.isArray(pathItem.get?.parameters))
    params.push(...pathItem.get!.parameters)
  const resolved = params
    .map((p) => (p && '$ref' in p ? resolveRef(spec, p.$ref) : p))
    .filter(Boolean) as Array<{ in?: string; name?: string }>
  const orderRe = /^order\[(.+)\]$/
  const keys = resolved
    .filter((p) => p.in === 'query' && typeof p.name === 'string')
    .map((p) => orderRe.exec(p.name as string))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => m[1] as string)
  return Array.from(new Set(keys)).sort()
}
// Header shape (loose) — only the fields we rely on
type HeaderLike = {
  key?: unknown
  sortable?: unknown
}
type ResourceConfigLike = {
  apiPath?: unknown
  defaultHeaders?: unknown
}
const collectSortableHeaderKeys = (cfg: ResourceConfigLike): string[] => {
  if (!Array.isArray(cfg.defaultHeaders)) return []
  const keys: string[] = []
  for (const h of cfg.defaultHeaders as HeaderLike[]) {
    if (!isObject(h)) continue
    if (h.sortable === false) continue
    if (typeof h.key !== 'string' || h.key.length === 0) continue
    keys.push(h.key)
  }
  return Array.from(new Set(keys)).sort()
}
async function main() {
  dotenv.config()
  const configsDir = path.resolve(
    projectRoot,
    'app/utils/consts/configs/data',
  )
  if (!fs.existsSync(configsDir)) {
    console.error(`Configs directory not found: ${configsDir}`)
    process.exit(1)
  }
  // CLI parsing — same flags as compare-query-params.ts
  const argv = process.argv.slice(2)
  const hasHelp = argv.includes('-h') || argv.includes('--help')
  let onlyError = argv.includes('--only-error') || argv.includes('-E')
  let requestedPath: string | undefined
  let apiUrl: string | undefined
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
    if (arg?.startsWith('--path=')) {
      requestedPath = arg.slice('--path='.length)
      continue
    }
    if (arg === '--api-url' || arg === '-u') {
      apiUrl = argv[i + 1]
      i++
      continue
    }
    if (arg?.startsWith('--api-url=')) {
      apiUrl = arg.slice('--api-url='.length)
      continue
    }
    if (!arg?.startsWith('-') && !requestedPath) {
      requestedPath = arg
    }
  }
  // Load every *.ts config and index by apiPath
  const files = fs
    .readdirSync(configsDir)
    .filter((f: string) => f.endsWith('.ts') && !f.endsWith('.d.ts'))
    .sort()
  const clientSortable: Record<string, string[]> = {}
  for (const file of files) {
    const full = path.join(configsDir, file)
    const url = pathToFileURL(full).href
    try {
      const mod: any = await import(url)
      const cfg: ResourceConfigLike | undefined = mod?.default
      if (!cfg || typeof cfg !== 'object') continue
      if (typeof cfg.apiPath !== 'string' || cfg.apiPath.length === 0) continue
      const keys = collectSortableHeaderKeys(cfg)
      // Keep the entry even if there are no sortable headers — useful to spot
      // unused `order[...]` API params on otherwise empty configs.
      clientSortable[cfg.apiPath] = keys
    } catch (e) {
      console.warn(
        `[compare-sortable-headers] Warning: failed to import ${file}:`,
        (e as Error)?.message ?? e,
      )
    }
  }
  const allPaths = Object.keys(clientSortable).sort()
  const printUsage = () => {
    console.log(
      'Usage: npx tsx bin/compare-sortable-headers.ts [--path <API_PATH>] [--only-error|-E] [--api-url <URL>]',
    )
    console.log('       npx tsx bin/compare-sortable-headers.ts <API_PATH>')
    console.log(
      '\nCompare client sortable header keys vs API `order[...]` query parameters per resource.',
    )
    console.log('\nOptions:')
    console.log(
      '  --path, -p <API_PATH>    Compare only the specified API path',
    )
    console.log(
      '  --only-error, -E         Show only keys present in client headers but missing in API `order[...]`',
    )
    console.log(
      '  --api-url, -u <URL>      Base URL of the API (default: http://nginx:80)',
    )
    console.log('\nAvailable paths:')
    for (const p of allPaths) console.log('  ' + p)
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
  const targetPaths = requestedPath ? [requestedPath] : allPaths
  if (targetPaths.length === 0) {
    console.log('No data resource configs found.')
    return
  }
  // Fetch OpenAPI spec
  const apiBaseUrl = apiUrl ?? 'http://nginx:80'
  console.log(`Fetching OpenAPI spec from: ${apiBaseUrl}/api/docs.jsonopenapi`)
  const schemaUrl = `${apiBaseUrl}/api/docs.jsonopenapi`
  const response = await fetch(schemaUrl)
  if (!response.ok) {
    console.error(
      `Failed to fetch OpenAPI spec: ${response.status} ${response.statusText}`,
    )
    process.exit(1)
  }
  const openApiSpec = (await response.json()) as OpenAPISpec
  const apiOrder: Record<string, string[]> = {}
  for (const apiPath of targetPaths) {
    apiOrder[apiPath] = collectOrderParamKeys(openApiSpec, apiPath)
  }
  if (!onlyError) {
    console.log(
      `${COLOR.yellow} Present in API \`order[...]\` but not in client sortable headers${COLOR.reset}`,
    )
    console.log(`${COLOR.green} Present in both${COLOR.reset}`)
    console.log(
      `${COLOR.red} Present in client sortable headers but missing in API \`order[...]\`${COLOR.reset}`,
    )
  }
  const summary: [number, number] = [0, 0] // [onlyApiCount, onlyClientCount]
  for (const apiPath of targetPaths) {
    const client = new Set(clientSortable[apiPath] ?? [])
    const api = new Set(apiOrder[apiPath] ?? [])
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
    if (onlyError && onlyClient.length === 0) continue
    console.log(`\n=== ${apiPath} ===`)
    if (onlyError) {
      for (const name of onlyClient)
        console.log(`${COLOR.red}${name}${COLOR.reset}`)
    } else {
      console.log('--- Only in API `order[...]` ---')
      for (const name of onlyApi)
        console.log(`${COLOR.yellow}${name}${COLOR.reset}`)
      console.log('--- Matching ---')
      for (const name of both)
        console.log(`${COLOR.green}${name}${COLOR.reset}`)
      console.log('--- Only in client headers (missing OrderFilter) ---')
      for (const name of onlyClient)
        console.log(`${COLOR.red}${name}${COLOR.reset}`)
    }
  }
  console.log(
    `\nSummary: ${summary[0]} path(s) with API-only order params, ${summary[1]} path(s) with client headers missing an OrderFilter.`,
  )
  if (summary[1] > 0) process.exit(1)
}
// Execute only when run directly
// @ts-expect-error import.meta.url
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('[compare-sortable-headers] Error:', err)
    process.exit(1)
  })
}
