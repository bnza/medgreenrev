import type {
  OperationPathParams,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { integer, maxValue, minValue, required, applyIf } from '@regle/rules'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'
import useResourceParent from '~/composables/useResourceParent'

const uniqueSite = useApiUniqueValidator(
  '/api/validator/unique/stratigraphic_units/{site}/{year}/{number}',
  ['site', 'year', 'number'],
  'Duplicate [site, year, number] combination',
)
const uniqueYear = useApiUniqueValidator(
  '/api/validator/unique/stratigraphic_units/{site}/{year}/{number}',
  ['year', 'site', 'number'],
  'Duplicate [year, site, number] combination',
)
const uniqueNumber = useApiUniqueValidator(
  '/api/validator/unique/stratigraphic_units/{site}/{year}/{number}',
  ['number', 'site', 'year'],
  'Duplicate [number, site, year] combination',
)

export function useCreateValidation(
  parent?: ResourceParent<'site', '/api/data/sites/{id}'>,
) {
  const { key: parentKey, iri: parentIri } = useResourceParent(parent)

  type RequestBody = PostCollectionRequestMap['/api/data/stratigraphic_units']
  const getEmptyModel = () =>
    ({
      site: parentKey.value === 'site' ? parentIri.value : undefined,
    }) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      site: {
        required,
        uniqueSite: uniqueSite(
          () => model.value.year || 0,
          () => model.value.number,
        ),
      },
      year: {
        integer,
        uniqueYear: uniqueYear(
          () => model.value.site,
          () => model.value.number,
        ),
        minValue: minValue(2000),
        maxValue: maxValue(new Date().getFullYear()),
      },
      number: {
        required,
        integer,
        minValue: minValue(1),
        uniqueNumber: uniqueNumber(
          () => model.value.site,
          () => model.value.year || 0,
        ),
      },
    }),
  )
  const { r$ } = useRegle(model, rules)

  return {
    getEmptyModel,
    r$,
  }
}

export function useUpdateValidation(
  params: Ref<
    OperationPathParams<'/api/data/stratigraphic_units/{id}', 'get'> | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/stratigraphic_units/{id}',
    params,
  )

  const siteChanged = computed(() => item.value.site !== model.value.site)
  const yearChanged = computed(() => item.value.year !== model.value.year)
  const numberChanged = computed(() => item.value.number !== model.value.number)

  const rules = computed(() => {
    const baseRules = {
      site: {
        required,
        // Conditionally add uniqueSite validation only when site has changed
        // Using spread operator to dynamically include async validators
        ...(siteChanged.value
          ? {
              uniqueSite: uniqueSite(
                () => model.value.year || 0,
                () => model.value.number,
              ),
            }
          : {}),
      },
      year: {
        integer: integer,
        // Conditionally add uniqueYear validation only when year has changed
        // Using spread operator to avoid applyIf + async validator issues
        ...(yearChanged.value
          ? {
              uniqueYear: uniqueYear(
                () => model.value.site,
                () => model.value.number,
              ),
            }
          : {}),
        minValue: minValue(2000),
        maxValue: maxValue(new Date().getFullYear()),
      },
      number: {
        required,
        integer,
        minValue: minValue(1),
        // Conditionally add uniqueNumber validation only when number has changed
        // Using spread operator to dynamically build validation rules
        ...(numberChanged.value
          ? {
              uniqueNumber: uniqueNumber(
                () => model.value.site,
                () => model.value.year || 0,
              ),
            }
          : {}),
      },
    }

    return inferRules(model, baseRules)
  })

  const { r$ } = useRegle(model, rules)
  return {
    responseItem,
    item,
    r$,
  }
}
