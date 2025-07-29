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
  parent?: ResourceParent<'site', '/api/sites/{id}'>,
) {
  const { key: parentKey, iri: parentIri } = useResourceParent(parent)

  type RequestBody = PostCollectionRequestMap['/api/stratigraphic_units']
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
    OperationPathParams<'/api/stratigraphic_units/{id}', 'get'> | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/stratigraphic_units/{id}',
    params,
  )

  const siteChanged = computed(() => item.value.site !== model.value.site)
  const yearChanged = computed(() => item.value.year !== model.value.year)
  const numberChanged = computed(() => item.value.number !== model.value.number)

  const rules = computed(() =>
    inferRules(model, {
      site: {
        required,
        uniqueSite: applyIf(
          //@TODO test, by now site is disabled in update form
          siteChanged,
          uniqueSite(
            () => model.value.year || 0,
            () => model.value.number,
          ),
        ),
      },
      year: {
        integer: integer,
        uniqueYear: applyIf(
          //@TODO test, by now year is disabled in update form
          yearChanged,
          uniqueYear(
            () => model.value.site,
            () => model.value.number,
          ),
        ),
        minValue: minValue(2000),
        maxValue: maxValue(new Date().getFullYear()),
      },
      number: {
        required,
        integer,
        minValue: minValue(1),
        uniqueNumber: applyIf(
          //@TODO test, by now number is disabled in update form
          numberChanged,
          uniqueNumber(
            () => model.value.site,
            () => model.value.year || 0,
          ),
        ),
      },
    }),
  )

  const { r$ } = useRegle(model, rules)
  return {
    responseItem,
    item,
    r$,
  }
}
