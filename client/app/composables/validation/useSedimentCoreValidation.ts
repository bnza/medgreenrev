import type {
  OperationPathParams,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { maxValue, minValue, required } from '@regle/rules'
import useResourceParent from '~/composables/useResourceParent'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'

const uniqueSite = useApiUniqueValidator(
  '/api/validator/unique/sediment_cores',
  ['site', 'year', 'number'],
  'Duplicate [site, year, number] combination',
)
const uniqueYear = useApiUniqueValidator(
  '/api/validator/unique/sediment_cores',
  ['year', 'site', 'number'],
  'Duplicate [site, year, number] combination',
)
const uniqueNumber = useApiUniqueValidator(
  '/api/validator/unique/sediment_cores',
  ['number', 'site', 'year'],
  'Duplicate [site, year, number] combination',
)
export function useCreateValidation(
  parent?: ResourceParent<'site', '/api/data/sites/{id}'>,
) {
  const { key: parentKey, iri: parentIri } = useResourceParent(parent)

  type RequestBody = PostCollectionRequestMap['/api/data/sediment_cores']
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
          () => model.value.year,
          () => model.value.number,
        ),
      },
      year: {
        uniqueYear: uniqueYear(
          () => model.value.site,
          () => model.value.number,
        ),
        minValue: minValue(2000),
        maxValue: maxValue(new Date().getFullYear()),
      },
      number: {
        required,
        minValue: minValue(1),
        uniqueNumber: uniqueNumber(
          () => model.value.site,
          () => model.value.year,
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
    OperationPathParams<'/api/data/sediment_cores/{id}', 'get'> | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/sediment_cores/{id}',
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
        // Using spread operator to dynamically include async validators and avoid applyIf issues
        ...(siteChanged.value
          ? {
              uniqueSite: uniqueSite(
                () => model.value.year,
                () => model.value.number,
              ),
            }
          : {}),
      },
      year: {
        minValue: minValue(2000),
        maxValue: maxValue(new Date().getFullYear()),
        // Conditionally add uniqueSite validation only when site has changed
        // Using spread operator to dynamically include async validators and avoid applyIf issues
        ...(yearChanged.value
          ? {
              uniqueYear: uniqueYear(
                () => model.value.site,
                () => model.value.number,
              ),
            }
          : {}),
      },
      number: {
        required,
        minValue: minValue(1),
        // Conditionally add uniqueSite validation only when site has changed
        // Using spread operator to dynamically include async validators and avoid applyIf issues
        ...(numberChanged.value
          ? {
              uniqueNumber: uniqueNumber(
                () => model.value.site,
                () => model.value.year,
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
