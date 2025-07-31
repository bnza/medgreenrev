import { describe, it, expect } from 'vitest'
import {
  normalizeResourceFiltersDefinition,
  createComponentFiltersMap,
} from '~/utils/filters'
import type {
  ResourceStaticFiltersDefinitionObject,
  ResourceFiltersDefinitionObject,
  AddToQueryObject,
} from '~~/types/filters'

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
              component: 'Single',
              addToQueryObject: mockAddToQuery,
            },
          },
        },
      }

      const result = normalizeResourceFiltersDefinition(staticDefinition)

      expect(result).toEqual({
        code: {
          SearchExact: {
            propertyLabel: 'code',
            operationLabel: 'equals',
            multiple: true,
            component: 'Single',
            addToQueryObject: mockAddToQuery,
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
              component: 'Single',
              addToQueryObject: mockAddToQuery,
            },
            Exists: {
              operationLabel: 'has any value',
              multiple: false,
              component: 'Boolean',
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
              component: 'Single',
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
              component: 'Single',
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
          propertyLabel: 'code',
          operationLabel: 'equals',
          multiple: true,
          componentKey: 'Single',
          addToQueryObject: mockAddToQuery,
        },
      },
      'culturalContexts.culturalContext': {
        SearchExact: {
          propertyLabel: 'cultural context',
          operationLabel: 'equals',
          multiple: false,
          componentKey: 'Single',
          addToQueryObject: mockAddToQuery,
        },
      },
      culturalContexts: {
        Exists: {
          propertyLabel: 'cultural context',
          operationLabel: 'has any value',
          multiple: false,
          componentKey: 'Boolean',
          addToQueryObject: mockAddToQueryMultiple,
        },
      },
      secretField: {
        SearchExact: {
          propertyLabel: 'secret field',
          operationLabel: 'equals',
          multiple: false,
          componentKey: 'Single',
          addToQueryObject: mockAddToQuery,
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
      const resourceFiltersWithUndefined: ResourceFiltersDefinitionObject = {
        validProperty: {
          SearchExact: {
            propertyLabel: 'valid',
            operationLabel: 'equals',
            multiple: false,
            componentKey: 'Single',
            addToQueryObject: mockAddToQuery,
          },
        },
      }

      // Simulate a missing property filter
      resourceFiltersWithUndefined['missingProperty'] = undefined as any

      const result = createComponentFiltersMap(
        resourceFiltersWithUndefined,
        true,
        [],
      )

      expect(result['valid']).toBeDefined()
      expect(Object.keys(result)).toHaveLength(1)
    })
  })
})
