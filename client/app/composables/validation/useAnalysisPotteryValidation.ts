import type {
  OperationPathParams,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'
import useAnalysisSubjectValidation from '~/composables/validation/shared/useAnalysisSubjectValidation'

const analysisSubjectRules = useAnalysisSubjectValidation(
  '/api/validator/unique/analyses/potteries/{analysis}/{subject}',
)

export function useCreateValidation(
  parent?:
    | ResourceParent<'pottery', '/api/data/potteries/{id}'>
    | ResourceParent<'analysis', '/api/data/analyses/{id}'>,
) {
  type RequestBody = PostCollectionRequestMap['/api/data/analyses/potteries']

  const { key: parentKey, iri: parentIri } = useResourceParent(parent)
  const getEmptyModel = () =>
    ({
      subject: parentKey.value === 'pottery' ? parentIri.value : undefined,
      analysis: parentKey.value === 'analysis' ? parentIri.value : undefined,
      summary: null,
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
    OperationPathParams<'/api/data/analyses/potteries/{id}', 'get'> | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/analyses/potteries/{id}',
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
