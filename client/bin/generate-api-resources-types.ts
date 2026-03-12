import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import dotenv from 'dotenv'

dotenv.config()

const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL
if (!apiBaseUrl) {
  console.error('NUXT_PUBLIC_API_BASE_URL is not defined in your .env file.')
  process.exit(1)
}

const indexUrl = `${apiBaseUrl}/api/index.jsonld`
const openApiUrl = `${apiBaseUrl}/api/docs.jsonopenapi`

console.log(`Fetching API index from: ${indexUrl}`)

try {
  // Fetch the API index
  const response = await fetch(indexUrl)

  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`)
    process.exit(1)
  }

  const data = (await response.json()) as Record<string, string>

  // Extract entries that don't start with '@'
  const resourceEntries = Object.entries(data).filter(
    ([key]) => !key.startsWith('@'),
  )

  if (resourceEntries.length === 0) {
    console.warn("No resource entries found (all keys start with '@')")
    process.exit(0)
  }

  // Generate API_RESOURCE_MAP object
  const resourceMapEntries = resourceEntries
    .map(([key, value]) => `  ${key}: '${value}'`)
    .join(',\n')

  // Fetch OpenAPI spec to build API_FEATURES_RESOURCE_MAP
  console.log(`Fetching OpenAPI spec from: ${openApiUrl}`)
  const openApiResponse = await fetch(openApiUrl)
  if (!openApiResponse.ok) {
    console.error(
      `HTTP error fetching OpenAPI! status: ${openApiResponse.status}`,
    )
    process.exit(1)
  }
  const openApi = (await openApiResponse.json()) as any

  type PathItem = {
    get?: {
      tags?: string[]
      responses?: {
        200?: { content?: Record<string, unknown> }
      }
    }
  }

  const paths: Record<string, PathItem> = openApi.paths || {}

  const hasGeoJson200 = (pi?: PathItem) => {
    const content = pi?.get?.responses?.[200]?.content
    return (
      content &&
      Object.prototype.hasOwnProperty.call(content, 'application/geo+json')
    )
  }

  const featurePaths = Object.keys(paths).filter((p) => hasGeoJson200(paths[p]))

  const isAggregatedPath = (p: string) => {
    const operation = paths[p]?.get
    if (!operation) return false

    // Check responses in OpenAPI
    const responses = operation.responses as any
    const content = responses?.[200]?.content
    const geoJsonSchema = content?.['application/geo+json']
    if (!geoJsonSchema) return false

    // Try to resolve schema reference if it exists
    let schema = geoJsonSchema.schema
    if (schema?.$ref) {
      const refPath = schema.$ref.split('/')
      let current = openApi
      for (let i = 1; i < refPath.length; i++) {
        current = current?.[refPath[i]]
      }
      schema = current
    }

    if (!schema) return false

    // Check if it's a FeatureCollection with number_matched features
    const featuresSchema = schema.properties?.features?.items
    let itemSchema = featuresSchema
    if (itemSchema?.$ref) {
      const refPath = itemSchema.$ref.split('/')
      let current = openApi
      for (let i = 1; i < refPath.length; i++) {
        current = current?.[refPath[i]]
      }
      itemSchema = current
    }

    // Check if the feature item schema has a number_matched property
    // Schema path: itemSchema.properties (Feature fields) → .properties (GeoJSON properties field) → .properties (object schema keys) → .number_matched
    return Boolean(
      itemSchema?.properties?.properties?.properties?.number_matched,
    )
  }

  const aggregatedFeaturePaths = featurePaths.filter(isAggregatedPath)
  console.log('Aggregated paths found:', aggregatedFeaturePaths)

  // Set of known API resource paths from the index
  const apiResourcePaths = new Set(
    Object.values(Object.fromEntries(resourceEntries)),
  )

  /**
   * Maps GeoJSON feature collection endpoints to their corresponding API resource collection paths.
   *
   * It uses a tag-based heuristic to match endpoints:
   * 1. Filters all OpenAPI paths that return 'application/geo+json' (feature collections).
   * 2. For each feature collection path, it finds all regular API resource collection paths (from the API index).
   * 3. It calculates a score based on the intersection of OpenAPI tags between the feature path and candidate resource paths.
   * 4. The resource path with the highest positive tag intersection score is selected as the mapping target.
   *
   * @param paths - The OpenAPI paths object.
   * @param apiResourcePaths - A set of known API resource paths from the API index.
   * @param featurePaths - All OpenAPI paths that return GeoJSON.
   * @returns An array of tuples mapping feature collection paths to API resource paths, sorted by feature path.
   */
  const getFeaturesResourceEntries = (
    paths: Record<string, PathItem>,
    apiResourcePaths: Set<string>,
    featurePaths: string[],
  ): [string, string][] => {
    const isApiResourcePath = (p: string) => apiResourcePaths.has(p)

    const getTags = (p: string) => paths[p]?.get?.tags || []

    const candidateResourcePaths = Array.from(apiResourcePaths).filter(
      (p): p is string => typeof p === 'string' && Boolean(paths[p]?.get),
    )

    const intersect = (a: string[], b: string[]) =>
      a.filter((t) => b.includes(t))

    const entries: [string, string][] = []
    for (const featPath of featurePaths) {
      const featTags = getTags(featPath)
      const matches = candidateResourcePaths
        .map((rp) => ({ rp, score: intersect(getTags(rp), featTags).length }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)

      const best = matches[0]?.rp
      if (best && isApiResourcePath(best)) {
        entries.push([featPath, best])
      }
    }

    // Sort entries for stable output
    return entries.sort((a, b) => a[0].localeCompare(b[0]))
  }

  const featuresResourceEntries = getFeaturesResourceEntries(
    paths,
    apiResourcePaths,
    featurePaths,
  )

  const featuresMapEntries = featuresResourceEntries
    .map(([key, value]) => `  '${key}': '${value}'`)
    .join(',\n')

  /**
   * Maps GeoJSON feature collection endpoints to their corresponding export endpoints.
   *
   * @param paths - The OpenAPI paths object.
   * @param featurePaths - All OpenAPI paths that return GeoJSON.
   * @returns An array of tuples mapping feature collection paths to export feature collection paths.
   */
  const getFeaturesExportResourceEntries = (
    paths: Record<string, PathItem>,
    featurePaths: string[],
  ): [string, string][] => {
    const entries: [string, string][] = []
    for (const featPath of featurePaths) {
      if (
        featPath.startsWith('/api/features/') &&
        !featPath.startsWith('/api/features/export/')
      ) {
        const exportPath = featPath.replace(
          '/api/features/',
          '/api/features/export/',
        )
        if (paths[exportPath]?.get) {
          entries.push([featPath, exportPath])
        }
      }
    }

    return entries.sort((a, b) => a[0].localeCompare(b[0]))
  }

  const featuresExportResourceEntries = getFeaturesExportResourceEntries(
    paths,
    featurePaths,
  )

  const featuresExportMapEntries = featuresExportResourceEntries
    .map(([key, value]) => `  '${key}': '${value}'`)
    .join(',\n')

  /**
   * Maps GeoJSON feature collection endpoints to their corresponding extent endpoints.
   *
   * @param paths - The OpenAPI paths object.
   * @param featurePaths - All OpenAPI paths that return GeoJSON.
   * @returns An array of tuples mapping feature collection paths to extent feature collection paths.
   */
  const getFeaturesExtentResourceEntries = (
    paths: Record<string, PathItem>,
    featurePaths: string[],
  ): [string, string][] => {
    const entries: [string, string][] = []
    for (const featPath of featurePaths) {
      if (
        featPath.startsWith('/api/features/') &&
        !featPath.startsWith('/api/features/extent_matched/')
      ) {
        const extentPath = featPath.replace(
          '/api/features/',
          '/api/features/extent_matched/',
        )
        if (paths[extentPath]?.get) {
          entries.push([featPath, extentPath])
        }
      }
    }

    return entries.sort((a, b) => a[0].localeCompare(b[0]))
  }

  const featuresExtentResourceEntries = getFeaturesExtentResourceEntries(
    paths,
    featurePaths,
  )

  const featuresExtentMapEntries = featuresExtentResourceEntries
    .map(([key, value]) => `  '${key}': '${value}'`)
    .join(',\n')

  const aggregatedFeaturePathsEntries = aggregatedFeaturePaths
    .map((p) => `  '${p}'`)
    .join(',\n')

  const extendsFeatureCollectionClause = '<P extends GetFeatureCollectionPath>'
  const satisfiesClause = 'Record<GetFeatureCollectionPath, GetCollectionPath>'
  const templateString =
    'Extract<GetItemPath, `${FeaturePathToApiResourcePath<P>}/{id}`>'

  const tsContent = `// Auto-generated from API index at ${indexUrl}
// Do not edit this file manually

import type {
  GetCollectionPath,
  GetExportFeatureCollectionPath,
  GetFeatureCollectionExtentPath,
  GetFeatureCollectionPath,
  GetAggregatedFeatureCollectionPath,
  GetItemPath,
} from '~~/types'

export const API_RESOURCE_MAP = {
${resourceMapEntries}
} as const

export type ApiResourceKey = keyof typeof API_RESOURCE_MAP

export type ApiResourcePath =
  (typeof API_RESOURCE_MAP)[keyof typeof API_RESOURCE_MAP]

// Map of feature collection endpoints (GeoJSON) to their related API resource collection path
// Keys are OpenAPI paths that return 200 with 'application/geo+json'
export const API_FEATURES_RESOURCE_MAP = {
    ${featuresMapEntries}
} as const satisfies ${satisfiesClause}

export const API_FEATURES_RESOURCE_EXPORT_MAP = {
    ${featuresExportMapEntries}
} as const satisfies Record<
  GetFeatureCollectionPath,
  GetExportFeatureCollectionPath
>

export const API_FEATURES_EXTENT_RESOURCE_MAP = {
    ${featuresExtentMapEntries}
} as const satisfies Record<
  GetFeatureCollectionPath,
  GetFeatureCollectionExtentPath
>

export const API_AGGREGATED_FEATURES_RESOURCE_PATHS: GetAggregatedFeatureCollectionPath[] = [
${aggregatedFeaturePathsEntries}
]

type FeaturesMap = typeof API_FEATURES_RESOURCE_MAP
export type FeaturePathToApiResourcePath${extendsFeatureCollectionClause} = FeaturesMap[P]

// Type helper: map a GetFeatureCollectionPath to the corresponding GetItemPath
// by appending '/{id}' to the related ApiResourcePath, and intersecting with GetItemPath
export type FeaturePathToItemPath${extendsFeatureCollectionClause} =
${templateString}
`

  // Ensure directory exists
  const outputPath = './app/utils/consts/resources.ts'
  mkdirSync(dirname(outputPath), { recursive: true })

  // Write the file
  writeFileSync(outputPath, tsContent, 'utf8')

  console.log(
    `Generated ${outputPath} with ${resourceEntries.length} resource entries, ${featuresResourceEntries.length} feature mappings, and ${featuresExportResourceEntries.length} feature export mappings`,
  )
  console.log('Resource keys:', resourceEntries.map(([key]) => key).join(', '))
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error('Error generating resource index types:', message)
  process.exit(1)
}
