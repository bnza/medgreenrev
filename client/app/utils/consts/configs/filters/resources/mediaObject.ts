import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import { API_FILTERS } from '~/utils/consts/configs/filters/definitions'

const { Boolean, Exists, SearchPartial, VocabularyMediaObjectType } =
  API_FILTERS

export const propertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    description: {
      filters: {
        Exists,
        SearchPartial,
      },
    },
    mimeType: {
      propertyLabel: 'mime type',
      filters: {
        SearchPartial,
      },
    },
    originalFilename: {
      propertyLabel: 'name',
      filters: {
        SearchPartial,
      },
    },
    public: {
      filters: {
        Boolean,
      },
    },
    type: {
      propertyLabel: 'type',
      filters: {
        VocabularyMediaObjectType,
      },
    },
    'uploadedBy.email': {
      propertyLabel: 'uploaded by',
      filters: {
        SearchPartial,
      },
    },
  } as const

export const staticFiltersDefinition: ResourceStaticFiltersDefinitionObject = {
  ...propertyStaticFiltersDefinition,
} as const
