import type { OpenAPIV3_1 } from 'openapi-types'
import type { GetCollectionPath } from '~~/types'
import type { ApiPathFilters } from '~~/types/filters'

/**
 * Extract the base name from a parameter name
 */
export const getBaseName = (paramName: string): string => {
  if (paramName.endsWith('[]')) {
    return paramName.slice(0, -2)
  } else if (paramName.includes('[') && paramName.includes(']')) {
    // Handle exists[property] and property[operation] formats
    if (paramName.startsWith('exists[')) {
      return paramName.slice(7, -1) // Remove 'exists[' and ']'
    } else {
      return paramName.split('[')[0] || paramName
    }
  } else {
    return paramName
  }
}

/**
 * Extract the operation type from a parameter name
 */
const getFilterOperationType = (paramName: string): string => {
  if (paramName.endsWith('[]')) {
    return 'in' // Array operation
  } else if (paramName.startsWith('exists[') && paramName.endsWith(']')) {
    return 'exists'
  } else if (paramName.includes('[') && paramName.includes(']')) {
    const parts = paramName.split('[')
    return parts[1]?.slice(0, -1) || 'equals' // Remove closing ] or default to 'equals'
  } else {
    return 'equals'
  }
}

/**
 * Step 1: Extract and filter parameters from a collection endpoint
 */
const extractCollectionParameters = (
  parameters: OpenAPIV3_1.ParameterObject[],
): OpenAPIV3_1.ParameterObject[] => {
  const excludedParams = new Set(['page', 'itemsPerPage', 'search'])

  return parameters.filter((param) => {
    // Filter out pagination and search params
    if (excludedParams.has(param.name)) return false

    // Filter out order parameters
    if (param.name.startsWith('order[')) return false

    // Only include query parameters
    if (param.in !== 'query') return false

    return true
  })
}

/**
 * Step 2: Remove singular versions when multiple versions exist
 */
export const removeSingularDuplicates = (
  parameters: OpenAPIV3_1.ParameterObject[],
): OpenAPIV3_1.ParameterObject[] => {
  const paramMap = new Map<string, OpenAPIV3_1.ParameterObject[]>()

  // Group parameters by their base name
  parameters.forEach((param) => {
    const baseName = getBaseName(param.name)

    if (!paramMap.has(baseName)) {
      paramMap.set(baseName, [])
    }
    paramMap.get(baseName)!.push(param)
  })

  // For each group, prefer array version over singular version
  const result: OpenAPIV3_1.ParameterObject[] = []

  paramMap.forEach((params, baseName) => {
    const hasArrayVersion = params.some((p) => p.name === `${baseName}[]`)
    const hasSingularVersion = params.some((p) => p.name === baseName)

    if (hasArrayVersion && hasSingularVersion) {
      // Keep all except the singular version
      result.push(...params.filter((p) => p.name !== baseName))
    } else {
      // Keep all parameters
      result.push(...params)
    }
  })

  return result
}

/**
 * Step 3: Aggregate parameters by property name
 */
export const aggregateByProperty = (
  parameters: OpenAPIV3_1.ParameterObject[],
): ApiPathFilters => {
  const propertyMap: ApiPathFilters = {}

  parameters.forEach((param) => {
    const propertyName = getBaseName(param.name)
    const operationType = getFilterOperationType(param.name)

    if (!propertyMap[propertyName]) {
      propertyMap[propertyName] = {}
    }

    // Ensure schema exists and is a SchemaObject
    if (
      param.schema &&
      typeof param.schema === 'object' &&
      !('$ref' in param.schema)
    ) {
      propertyMap[propertyName][operationType] = {
        name: param.name,
        schema: param.schema as OpenAPIV3_1.SchemaObject,
        description: param.description,
        multiple: operationType === 'in' || param.name.endsWith('[]'),
      }
    }
  })

  return propertyMap
}

/**
 * Process a specific path from OpenAPI spec to extract filter configuration
 */
export const processPathFilters = (
  openApiSpec: OpenAPIV3_1.Document,
  path: GetCollectionPath,
): ApiPathFilters => {
  const pathItem = openApiSpec.paths?.[path]

  if (!pathItem?.get?.parameters) {
    return {}
  }

  // Filter out reference objects and only work with parameter objects
  const parameters = pathItem.get.parameters.filter(
    (param): param is OpenAPIV3_1.ParameterObject => !('$ref' in param),
  )

  // Step 1: Extract relevant parameters
  const filteredParams = extractCollectionParameters(parameters)

  // Step 2: Remove singular duplicates
  const deduplicatedParams = removeSingularDuplicates(filteredParams)

  // Step 3: Aggregate by property
  return aggregateByProperty(deduplicatedParams)
}

/**
 * Helper function to get available properties for filters
 */
export const getAvailableProperties = (
  pathFilters: ApiPathFilters,
): string[] => {
  return Object.keys(pathFilters)
}

/**
 * Helper function to get available operations for a property
 */
export const getAvailableOperations = (
  pathFilters: ApiPathFilters,
  property: string,
): string[] => {
  const propertyFilters = pathFilters[property]
  return propertyFilters ? Object.keys(propertyFilters) : []
}
