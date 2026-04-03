import { describe, it, expect, vi } from 'vitest'
import {
  normalizeResourceFiltersDefinition,
  createComponentFiltersMap,
  createAvailableFiltersMap,
} from '~/utils/filters'
import type {
  ResourceStaticFiltersDefinitionObject,
  ResourceFiltersDefinitionObject,
  AddToQueryObject,
  ComponentFiltersMap,
  FilterState,
} from '~~/types/filters'

// Mock API_FILTERS
vi.mock('~/utils/consts/configs/filters', () => ({
  API_FILTERS: {
    SearchExact: { multiple: false },
    SearchPartial: { multiple: true },
    Exists: { multiple: false },
    DateRange: { multiple: true },
  },
}))

// Mock AddToQueryObject functions for testing
const mockAddToQuery: AddToQueryObject = (queryObject, filter) => {
  queryObject[filter.property] = filter.operands[0]
}

const mockAddToQueryMultiple: AddToQueryObject = (queryObject, filter) => {
  if (!(filter.property in queryObject)) {
    queryObject[filter.property] = []
  }
  queryObject[filter.property].push(filter.operands[0])
}

describe('filters', () => {
  describe('normalizeResourceFiltersDefinition', () => {
    it('should normalize static definition with default propertyLabel', () => {
      const staticDefinition: ResourceStaticFiltersDefinitionObject = {
        code: {
          filters: {
            SearchExact: {
              operationLabel: 'equals',
              multiple: true,
              componentKey: 'Single',
              addToQueryObject: mockAddToQuery,
            },
          },
        },
      }

      const result = normalizeResourceFiltersDefinition(staticDefinition)

      expect(result).toEqual({
        code: {
          SearchExact: {
            key: 'SearchExact',
            property: 'code',
            propertyLabel: 'code',
            operationLabel: 'equals',
            multiple: true,
            componentKey: 'Single',
          },
        },
      })
    })

    it('should use custom propertyLabel when provided', () => {
      const staticDefinition: ResourceStaticFiltersDefinitionObject = {
        'culturalContexts.culturalContext': {
          propertyLabel: 'cultural context',
          filters: {
            SearchExact: {
              operationLabel: 'equals',
              multiple: false,
              componentKey: 'Single',
              addToQueryObject: mockAddToQuery,
            },
            Exists: {
              operationLabel: 'has any value',
              multiple: false,
              componentKey: 'Boolean',
              addToQueryObject: mockAddToQueryMultiple,
            },
          },
        },
      }

      const result = normalizeResourceFiltersDefinition(staticDefinition)

      expect(
        result['culturalContexts.culturalContext']!['SearchExact']!
          .propertyLabel,
      ).toBe('cultural context')
      expect(
        result['culturalContexts.culturalContext']!['Exists']!.propertyLabel,
      ).toBe('cultural context')
    })

    it('should handle multiple properties', () => {
      const staticDefinition: ResourceStaticFiltersDefinitionObject = {
        code: {
          filters: {
            SearchExact: {
              operationLabel: 'equals',
              multiple: true,
              componentKey: 'Single',
              addToQueryObject: mockAddToQuery,
            },
          },
        },
        fieldDirector: {
          propertyLabel: 'field director',
          filters: {
            SearchPartial: {
              operationLabel: 'contains',
              multiple: false,
              componentKey: 'Single',
              addToQueryObject: mockAddToQuery,
            },
          },
        },
      }

      const result = normalizeResourceFiltersDefinition(staticDefinition)

      expect(Object.keys(result)).toHaveLength(2)
      expect(result['code']!['SearchExact']!.propertyLabel).toBe('code')
      expect(result['fieldDirector']!['SearchPartial']!.propertyLabel).toBe(
        'field director',
      )
    })
  })

  describe('createComponentFiltersMap', () => {
    const mockResourceFilters: ResourceFiltersDefinitionObject = {
      code: {
        SearchExact: {
          key: 'SearchExact',
          property: 'code',
          propertyLabel: 'code',
          operationLabel: 'equals',
          multiple: true,
          componentKey: 'Single',
        },
      },
      'culturalContexts.culturalContext': {
        SearchExact: {
          key: 'SearchExact',
          property: 'culturalContexts.culturalContext',
          propertyLabel: 'cultural context',
          operationLabel: 'equals',
          multiple: false,
          componentKey: 'Single',
        },
      },
      culturalContexts: {
        Exists: {
          key: 'Exists',
          property: 'culturalContexts',
          propertyLabel: 'cultural context',
          operationLabel: 'has any value',
          multiple: false,
          componentKey: 'Boolean',
        },
      },
      secretField: {
        SearchExact: {
          key: 'SearchExact',
          property: 'secretField',
          propertyLabel: 'secret field',
          operationLabel: 'equals',
          multiple: false,
          componentKey: 'Single',
        },
      },
    }

    it('should create component filters map for authenticated user', () => {
      const result = createComponentFiltersMap(mockResourceFilters, true, [
        'secretField',
      ])

      expect(result).toEqual({
        code: {
          equals: mockResourceFilters['code']!['SearchExact'],
        },
        'cultural context': {
          equals:
            mockResourceFilters['culturalContexts.culturalContext']![
              'SearchExact'
            ],
          'has any value': mockResourceFilters['culturalContexts']!['Exists'],
        },
        'secret field': {
          equals: mockResourceFilters['secretField']!['SearchExact'],
        },
      })
    })

    it('should exclude protected fields for unauthenticated user', () => {
      const result = createComponentFiltersMap(mockResourceFilters, false, [
        'secretField',
      ])

      expect(result).toEqual({
        code: {
          equals: mockResourceFilters['code']!['SearchExact'],
        },
        'cultural context': {
          equals:
            mockResourceFilters['culturalContexts.culturalContext']![
              'SearchExact'
            ],
          'has any value': mockResourceFilters['culturalContexts']!['Exists'],
        },
      })
      expect(result['secret field']).toBeUndefined()
    })

    it('should handle empty protected fields array', () => {
      const result = createComponentFiltersMap(mockResourceFilters, false)

      expect(Object.keys(result)).toHaveLength(3)
      expect(result['code']).toBeDefined()
      expect(result['cultural context']).toBeDefined()
      expect(result['secret field']).toBeDefined()
    })

    it('should handle empty resource filters', () => {
      const result = createComponentFiltersMap({}, true, [])

      expect(result).toEqual({})
    })

    it('should group multiple filters under same propertyLabel', () => {
      const result = createComponentFiltersMap(mockResourceFilters, true, [])

      expect(result['cultural context']).toHaveProperty('equals')
      expect(result['cultural context']).toHaveProperty('has any value')
      expect(Object.keys(result['cultural context']!)).toHaveLength(2)
    })

    it('should handle missing property filters gracefully', () => {
      const resourceFiltersWithUndefined = {
        validProperty: {
          SearchExact: {
            key: 'SearchExact' as const,
            property: 'validProperty',
            propertyLabel: 'valid',
            operationLabel: 'equals',
            multiple: false,
            componentKey: 'Single' as const,
          },
        },
      }

      // Simulate a missing property filter
      // @ts-expect-error unexistent property
      resourceFiltersWithUndefined['missingProperty'] = undefined as any

      const result = createComponentFiltersMap(
        resourceFiltersWithUndefined as any,
        true,
        [],
      )

      expect(result['valid']).toBeDefined()
      expect(Object.keys(result)).toHaveLength(1)
    })
  })

  describe('createAvailableFiltersMap', () => {
    const mockComponentFiltersMap: ComponentFiltersMap = {
      name: {
        equals: {
          key: 'SearchExact',
          property: 'name',
          propertyLabel: 'name',
          operationLabel: 'equals',
          multiple: false,
          componentKey: 'Single',
        },
        contains: {
          key: 'SearchPartial',
          property: 'name',
          propertyLabel: 'name',
          operationLabel: 'contains',
          multiple: true,
          componentKey: 'Single',
        },
      },
      status: {
        equals: {
          key: 'SearchExact',
          property: 'status',
          propertyLabel: 'status',
          operationLabel: 'equals',
          multiple: false,
          componentKey: 'Single',
        },
        exists: {
          key: 'Exists',
          property: 'status',
          propertyLabel: 'status',
          operationLabel: 'exists',
          multiple: false,
          componentKey: 'Boolean',
        },
      },
      'date range': {
        between: {
          //@ts-expect-error FILTERS_MAP is mocked
          key: 'DateRange',
          property: 'createdAt',
          propertyLabel: 'date range',
          operationLabel: 'between',
          multiple: true,
          componentKey: 'Single',
        },
      },
    }

    it('should return all filters when no active filters exist', () => {
      const filters: FilterState = {}

      const result = createAvailableFiltersMap(mockComponentFiltersMap, filters)

      expect(result).toEqual(mockComponentFiltersMap)
    })

    it('should exclude single-use filters that are already active', () => {
      const filters: FilterState = {
        filter1: {
          key: 'SearchExact',
          property: 'name',
          operands: ['test'],
        },
        filter2: {
          key: 'Exists',
          property: 'status',
          operands: [true],
        },
      }

      const result = createAvailableFiltersMap(mockComponentFiltersMap, filters)

      expect(result).toEqual({
        name: {
          contains: mockComponentFiltersMap['name']!['contains'],
        },
        status: {
          equals: mockComponentFiltersMap['status']!['equals'],
        },
        'date range': {
          between: mockComponentFiltersMap['date range']!['between'],
        },
      })
    })

    it('should include multi-use filters even when already active', () => {
      const filters: FilterState = {
        filter1: {
          key: 'SearchPartial',
          property: 'name',
          operands: ['test'],
        },
        filter2: {
          //@ts-expect-error FILTERS_MAP is mocked
          key: 'DateRange',
          property: 'createdAt',
          operands: ['2023-01-01', '2023-12-31'],
        },
      }

      const result = createAvailableFiltersMap(mockComponentFiltersMap, filters)

      expect(result).toEqual({
        name: {
          equals: mockComponentFiltersMap['name']!['equals'],
          contains: mockComponentFiltersMap['name']!['contains'], // Still available (multiple: true)
        },
        status: {
          equals: mockComponentFiltersMap['status']!['equals'],
          exists: mockComponentFiltersMap['status']!['exists'],
        },
        'date range': {
          between: mockComponentFiltersMap['date range']!['between'], // Still available (multiple: true)
        },
      })
    })

    it('should remove entire property when all operations are filtered out', () => {
      const filters: FilterState = {
        filter1: {
          key: 'SearchExact',
          property: 'status',
          operands: ['active'],
        },
        filter2: {
          key: 'Exists',
          property: 'status',
          operands: [true],
        },
      }

      const result = createAvailableFiltersMap(mockComponentFiltersMap, filters)

      expect(result).toEqual({
        name: {
          equals: mockComponentFiltersMap['name']!['equals'],
          contains: mockComponentFiltersMap['name']!['contains'],
        },
        'date range': {
          between: mockComponentFiltersMap['date range']!['between'],
        },
      })
      expect(result['status']).toBeUndefined()
    })

    it('should handle empty component filters map', () => {
      const filters: FilterState = {}

      const result = createAvailableFiltersMap({}, filters)

      expect(result).toEqual({})
    })

    it('should handle mixed scenarios with multiple and single-use filters', () => {
      const filters: FilterState = {
        filter1: {
          key: 'SearchExact',
          property: 'name',
          operands: ['John'],
        },
        filter2: {
          key: 'SearchPartial',
          property: 'name',
          operands: ['Doe'],
        },
        filter3: {
          //@ts-expect-error FILTERS_MAP is mocked
          key: 'DateRange',
          property: 'createdAt',
          operands: ['2023-01-01', '2023-06-30'],
        },
      }

      const result = createAvailableFiltersMap(mockComponentFiltersMap, filters)

      expect(result).toEqual({
        name: {
          contains: mockComponentFiltersMap['name']!['contains'], // Multiple allowed
        },
        status: {
          equals: mockComponentFiltersMap['status']!['equals'],
          exists: mockComponentFiltersMap['status']!['exists'],
        },
        'date range': {
          between: mockComponentFiltersMap['date range']!['between'], // Multiple allowed
        },
      })
    })

    it('should handle filters with different property paths but same key', () => {
      const extendedComponentFiltersMap: ComponentFiltersMap = {
        ...mockComponentFiltersMap,
        description: {
          equals: {
            key: 'SearchExact',
            property: 'description',
            propertyLabel: 'description',
            operationLabel: 'equals',
            multiple: false,
            componentKey: 'Single',
          },
        },
      }

      const filters: FilterState = {
        filter1: {
          key: 'SearchExact',
          property: 'name', // Same key, different property
          operands: ['test'],
        },
      }

      const result = createAvailableFiltersMap(
        extendedComponentFiltersMap,
        filters,
      )

      expect(result['name']!['equals']).toBeUndefined() // Filtered out
      expect(result['description']!['equals']).toBeDefined() // Different property, should remain
    })
  })
})
