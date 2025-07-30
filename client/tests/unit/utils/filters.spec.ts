import { describe, it, expect, beforeEach } from 'vitest'
import type { OpenAPIV3_1 } from 'openapi-types'
import {
  getBaseName,
  processPathFilters,
  getAvailableProperties,
  getAvailableOperations,
} from '~/utils/filters'
import type { GetCollectionPath } from '~~/types'
import type { ApiPathFilters } from '~~/types/filters'

describe('filters.ts', () => {
  describe('getBaseName', () => {
    it('should extract base name from array parameters', () => {
      expect(getBaseName('code[]')).toBe('code')
      expect(getBaseName('culturalContexts[]')).toBe('culturalContexts')
      expect(getBaseName('chronologyLower[]')).toBe('chronologyLower')
    })

    it('should extract base name from exists parameters', () => {
      expect(getBaseName('exists[chronologyLower]')).toBe('chronologyLower')
      expect(getBaseName('exists[description]')).toBe('description')
      expect(getBaseName('exists[culturalContexts]')).toBe('culturalContexts')
    })

    it('should extract base name from operation parameters', () => {
      expect(getBaseName('chronologyLower[between]')).toBe('chronologyLower')
      expect(getBaseName('chronologyUpper[gt]')).toBe('chronologyUpper')
      expect(getBaseName('chronologyLower[gte]')).toBe('chronologyLower')
      expect(getBaseName('chronologyUpper[lt]')).toBe('chronologyUpper')
      expect(getBaseName('chronologyLower[lte]')).toBe('chronologyLower')
    })

    it('should return original name for simple parameters', () => {
      expect(getBaseName('code')).toBe('code')
      expect(getBaseName('name')).toBe('name')
      expect(getBaseName('description')).toBe('description')
      expect(getBaseName('fieldDirector')).toBe('fieldDirector')
    })

    it('should handle edge cases gracefully', () => {
      expect(getBaseName('param[invalid')).toBe('param[invalid') // No closing bracket, return as-is
      expect(getBaseName('param]invalid[')).toBe('param]invalid') // Malformed, return as-is
      expect(getBaseName('param[]extra')).toBe('param') // Extra content after [], return param
      expect(getBaseName('')).toBe('')
    })

    it('should handle nested property names', () => {
      expect(getBaseName('culturalContexts.culturalContext')).toBe(
        'culturalContexts.culturalContext',
      )
      expect(getBaseName('culturalContexts.culturalContext[]')).toBe(
        'culturalContexts.culturalContext',
      )
    })
  })

  describe('processPathFilters', () => {
    let mockOpenApiSpec: OpenAPIV3_1.Document

    beforeEach(() => {
      mockOpenApiSpec = {
        openapi: '3.1.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/api/sites': {
            get: {
              operationId: 'test_operation',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                      },
                    },
                  },
                },
              },
              parameters: [
                // Pagination params (should be excluded)
                {
                  name: 'page',
                  in: 'query',
                  required: false,
                  schema: { type: 'integer' },
                },
                {
                  name: 'itemsPerPage',
                  in: 'query',
                  required: false,
                  schema: { type: 'integer' },
                },
                {
                  name: 'search',
                  in: 'query',
                  required: false,
                  schema: { type: 'string' },
                },
                // Order params (should be excluded)
                {
                  name: 'order[id]',
                  in: 'query',
                  required: false,
                  schema: { type: 'string', enum: ['asc', 'desc'] },
                },
                // Filter params (should be included)
                {
                  name: 'code',
                  in: 'query',
                  required: false,
                  schema: { type: 'string' },
                  description: 'Filter by code',
                },
                {
                  name: 'code[]',
                  in: 'query',
                  required: false,
                  schema: { type: 'array', items: { type: 'string' } },
                },
                {
                  name: 'chronologyLower[between]',
                  in: 'query',
                  required: false,
                  schema: { type: 'string' },
                },
                {
                  name: 'chronologyLower[gt]',
                  in: 'query',
                  required: false,
                  schema: { type: 'string' },
                },
                {
                  name: 'exists[description]',
                  in: 'query',
                  required: false,
                  schema: { type: 'boolean' },
                },
                {
                  name: 'name',
                  in: 'query',
                  required: false,
                  schema: { type: 'string' },
                  description: 'Filter by name',
                },
              ],
            },
          },
        },
      } as OpenAPIV3_1.Document
    })

    it('should process valid collection path with filters', () => {
      const result = processPathFilters(
        mockOpenApiSpec,
        '/api/sites' as GetCollectionPath,
      )

      expect(result).toHaveProperty('code')
      expect(result).toHaveProperty('chronologyLower')
      expect(result).toHaveProperty('description')
      expect(result).toHaveProperty('name')

      // Should have operations
      expect(result.code).toHaveProperty('in')
      expect(result.chronologyLower).toHaveProperty('between')
      expect(result.chronologyLower).toHaveProperty('gt')
      expect(result.description).toHaveProperty('exists')
      expect(result.name).toHaveProperty('equals')
    })

    it('should remove singular duplicates when array version exists', () => {
      const result = processPathFilters(
        mockOpenApiSpec,
        '/api/sites' as GetCollectionPath,
      )

      // Should only have 'in' operation for code (from code[])
      expect(result.code).toHaveProperty('in')
      expect(result.code).not.toHaveProperty('equals')
    })

    it('should return empty object for non-existent path', () => {
      const result = processPathFilters(
        mockOpenApiSpec,
        '/api/nonexistent' as GetCollectionPath,
      )
      expect(result).toEqual({})
    })

    it('should return empty object for path without GET operation', () => {
      mockOpenApiSpec.paths!['/api/sites']!.get = undefined
      const result = processPathFilters(
        mockOpenApiSpec,
        '/api/sites' as GetCollectionPath,
      )
      expect(result).toEqual({})
    })

    it('should return empty object for path without parameters', () => {
      mockOpenApiSpec.paths!['/api/sites']!.get!.parameters = []
      const result = processPathFilters(
        mockOpenApiSpec,
        '/api/sites' as GetCollectionPath,
      )
      expect(result).toEqual({})
    })

    it('should handle path parameters correctly (exclude them)', () => {
      mockOpenApiSpec.paths!['/api/sites']!.get!.parameters!.push({
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
      })

      const result = processPathFilters(
        mockOpenApiSpec,
        '/api/sites' as GetCollectionPath,
      )
      expect(result).not.toHaveProperty('id')
    })

    it('should handle parameters with $ref (skip them)', () => {
      mockOpenApiSpec.paths!['/api/sites']!.get!.parameters!.push({
        $ref: '#/components/parameters/TestParam',
      })

      const result = processPathFilters(
        mockOpenApiSpec,
        '/api/sites' as GetCollectionPath,
      )
      // Should still work with other parameters
      expect(result).toHaveProperty('code')
    })

    it('should handle empty OpenAPI spec', () => {
      const emptySpec: OpenAPIV3_1.Document = {
        openapi: '3.1.0',
        info: { title: 'Empty API', version: '1.0.0' },
        paths: {},
      }

      const result = processPathFilters(
        emptySpec,
        '/api/sites' as GetCollectionPath,
      )
      expect(result).toEqual({})
    })
  })

  describe('getAvailableProperties', () => {
    it('should return array of property names', () => {
      const pathFilters: ApiPathFilters = {
        code: {
          equals: { name: 'code', schema: { type: 'string' } },
          in: {
            name: 'code[]',
            schema: { type: 'array', items: { type: 'string' } },
          },
        },
        name: {
          equals: { name: 'name', schema: { type: 'string' } },
        },
      }

      const result = getAvailableProperties(pathFilters)
      expect(result).toEqual(['code', 'name'])
    })

    it('should return empty array for empty filters', () => {
      const result = getAvailableProperties({})
      expect(result).toEqual([])
    })

    it('should maintain property order', () => {
      const pathFilters: ApiPathFilters = {
        zebra: { equals: { name: 'zebra', schema: { type: 'string' } } },
        alpha: { equals: { name: 'alpha', schema: { type: 'string' } } },
        beta: { equals: { name: 'beta', schema: { type: 'string' } } },
      }

      const result = getAvailableProperties(pathFilters)
      expect(result).toEqual(['zebra', 'alpha', 'beta'])
    })
  })

  describe('getAvailableOperations', () => {
    it('should return array of operation names for existing property', () => {
      const pathFilters: ApiPathFilters = {
        chronologyLower: {
          between: {
            name: 'chronologyLower[between]',
            schema: { type: 'string' },
          },
          gt: { name: 'chronologyLower[gt]', schema: { type: 'string' } },
          gte: { name: 'chronologyLower[gte]', schema: { type: 'string' } },
        },
      }

      const result = getAvailableOperations(pathFilters, 'chronologyLower')
      expect(result).toEqual(['between', 'gt', 'gte'])
    })

    it('should return empty array for non-existent property', () => {
      const pathFilters: ApiPathFilters = {
        code: {
          equals: { name: 'code', schema: { type: 'string' } },
        },
      }

      const result = getAvailableOperations(pathFilters, 'nonexistent')
      expect(result).toEqual([])
    })

    it('should return empty array for empty filters', () => {
      const result = getAvailableOperations({}, 'anyProperty')
      expect(result).toEqual([])
    })

    it('should handle property with single operation', () => {
      const pathFilters: ApiPathFilters = {
        name: {
          equals: { name: 'name', schema: { type: 'string' } },
        },
      }

      const result = getAvailableOperations(pathFilters, 'name')
      expect(result).toEqual(['equals'])
    })
  })

  describe('integration tests', () => {
    it('should work with real OpenAPI spec structure', () => {
      const realSpec: OpenAPIV3_1.Document = {
        openapi: '3.1.0',
        info: { title: 'Real API', version: '1.0.0' },
        paths: {
          //@ts-expect-error type mismatch
          '/api/sites': {
            get: {
              operationId: 'real_operation',
              responses: {
                '200': {
                  description: 'Success',
                },
              },
              parameters: [
                {
                  name: 'page',
                  in: 'query',
                  required: false,
                  schema: { type: 'integer' },
                },
                {
                  name: 'itemsPerPage',
                  in: 'query',
                  required: false,
                  schema: { type: 'integer' },
                },
                {
                  name: 'search',
                  in: 'query',
                  required: false,
                  schema: { type: 'string' },
                },
                {
                  name: 'order[code]',
                  in: 'query',
                  required: false,
                  schema: { type: 'string' },
                },
                {
                  name: 'code',
                  in: 'query',
                  required: false,
                  schema: { type: 'string' },
                },
                {
                  name: 'code[]',
                  in: 'query',
                  required: false,
                  schema: { type: 'array' },
                },
                {
                  name: 'exists[description]',
                  in: 'query',
                  required: false,
                  schema: { type: 'boolean' },
                },
                {
                  name: 'chronologyLower[gt]',
                  in: 'query',
                  required: false,
                  schema: { type: 'string' },
                },
              ],
            },
          },
        },
      }

      const pathFilters = processPathFilters(
        realSpec,
        '/api/sites' as GetCollectionPath,
      )
      const properties = getAvailableProperties(pathFilters)
      const codeOperations = getAvailableOperations(pathFilters, 'code')
      const chronologyOperations = getAvailableOperations(
        pathFilters,
        'chronologyLower',
      )

      expect(properties).toContain('code')
      expect(properties).toContain('description')
      expect(properties).toContain('chronologyLower')
      expect(codeOperations).toEqual(['in']) // Only array version should remain
      expect(chronologyOperations).toEqual(['gt'])
    })
  })
})
