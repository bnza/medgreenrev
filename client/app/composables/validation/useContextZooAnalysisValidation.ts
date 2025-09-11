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
  parent?: ResourceParent<'context', '/api/data/contexts/{id}'>,
) {
  type RequestBody = PostCollectionRequestMap['/api/data/analyses/contexts/zoo']

  const { key: parentKey, iri: parentIri } = useResourceParent(parent)
  const getEmptyModel = () =>
    ({
      item: parentKey.value === 'context' ? parentIri.value : undefined,
      document: null,
      rawData: null,
      summary: null,
    }) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      item: { required },
      type: { required },
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
    | OperationPathParams<'/api/data/analyses/contexts/zoo/{id}', 'get'>
    | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/analyses/contexts/zoo/{id}',
    params,
  )

  const rules = computed(() =>
    inferRules(model, {
      item: { required },
      type: { required },
    }),
  )

  const { r$ } = useRegle(model, rules)
  return {
    responseItem,
    item,
    r$,
  }
}
