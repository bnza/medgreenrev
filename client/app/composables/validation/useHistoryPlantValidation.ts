import type {
  OperationPathParams,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { integer, maxValue, minValue, required } from '@regle/rules'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'

export function useCreateValidation(
  parent?: ResourceParent<'historyLocation'>,
) {
  const { key: parentKey, iri: parentIri } = useResourceParent(parent)
  type RequestBody = PostCollectionRequestMap['/api/data/history/plants']
  const getEmptyModel = () =>
    ({
      location:
        parentKey.value === 'historyLocation' ? parentIri.value : undefined,
    }) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      plant: {
        required,
      },
      location: {
        required,
      },
      chronologyLower: {
        integer,
        minValue: minValue(-32768),
        maxValue: maxValue(new Date().getFullYear()),
        lessThanOrEqual: lessThanOrEqual(
          'Lower chronology must be greater than or equal upper chronology.',
        )(() => model.value.chronologyUpper),
      },
      chronologyUpper: {
        integer,
        minValue: minValue(-32768),
        maxValue: maxValue(new Date().getFullYear()),
        greaterOrEqualThan: greaterThanOrEqual(
          'Upper chronology must be less than or equal lower chronology.',
        )(() => model.value.chronologyLower),
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
    OperationPathParams<'/api/data/history/plants/{id}', 'get'> | undefined
  >,
) {
  const { item, model, responseItem } = useGetPatchItemQuery(
    '/api/data/history/plants/{id}',
    params,
  )

  const rules = computed(() =>
    inferRules(model, {
      plant: {
        required,
      },
      location: {
        required,
      },
      reference: {
        required,
      },
      chronologyLower: {
        integer,
        minValue: minValue(-32768),
        maxValue: maxValue(new Date().getFullYear()),
        lessThanOrEqual: lessThanOrEqual(
          'Lower chronology must be greater than or equal upper chronology.',
        )(() => model.value.chronologyUpper),
      },
      chronologyUpper: {
        integer,
        minValue: minValue(-32768),
        maxValue: maxValue(new Date().getFullYear()),
        greaterOrEqualThan: greaterThanOrEqual(
          'Upper chronology must be less than or equal lower chronology.',
        )(() => model.value.chronologyLower),
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
