import type {
  OperationPathParams,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'

import useAnalysisSubjectValidation from '~/composables/validation/shared/useAnalysisSubjectValidation'

const analysisSubjectRules = useAnalysisSubjectValidation(
  '/api/validator/unique/analyses/zoo/teeth',
)

export function useCreateValidation(
  parent?:
    | ResourceParent<'zooTooth', '/api/data/zoo/teeth/{id}'>
    | ResourceParent<'analysis', '/api/data/analyses/{id}'>,
) {
  type RequestBody = PostCollectionRequestMap['/api/data/analyses/zoo/teeth']

  const { key: parentKey, iri: parentIri } = useResourceParent(parent)
  const getEmptyModel = () =>
    ({
      subject: parentKey.value === 'zooTooth' ? parentIri.value : undefined,
      analysis: parentKey.value === 'analysis' ? parentIri.value : undefined,
    }) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, { ...analysisSubjectRules(model) }),
  )
  const { r$ } = useRegle(model, rules)

  return {
    getEmptyModel,
    r$,
  }
}

export function useUpdateValidation(
  params: Ref<
    OperationPathParams<'/api/data/analyses/zoo/teeth/{id}', 'get'> | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/analyses/zoo/teeth/{id}',
    params,
  )

  const rules = computed(() => inferRules(model, {}))

  const { r$ } = useRegle(model, rules)
  return {
    responseItem,
    item,
    r$,
  }
}
