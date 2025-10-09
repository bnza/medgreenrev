import type {
  OperationPathParams,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { required } from '@regle/rules'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'
import useResourceParent from '~/composables/useResourceParent'

export function useCreateValidation(
  parent?: ResourceParent<'stratigraphicUnit'>,
) {
  type RequestBody = PostCollectionRequestMap['/api/data/botany/seeds']

  const { key: parentKey, iri: parentIri } = useResourceParent(parent)

  const getEmptyModel = () =>
    ({
      stratigraphicUnit:
        parentKey.value === 'stratigraphicUnit' ? parentIri.value : undefined,
      taxonomy: null,
      element: null,
      part: null,
    }) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      stratigraphicUnit: { required },
      element: { required },
      taxonomy: { required },
      part: { required },
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
    OperationPathParams<'/api/data/botany/seeds/{id}', 'get'> | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/botany/seeds/{id}',
    params,
  )

  const rules = computed(() =>
    inferRules(model, {
      stratigraphicUnit: { required },
      element: { required },
      taxonomy: { required },
      part: { required },
    }),
  )

  const { r$ } = useRegle(model, rules)
  return {
    responseItem,
    item,
    r$,
  }
}
