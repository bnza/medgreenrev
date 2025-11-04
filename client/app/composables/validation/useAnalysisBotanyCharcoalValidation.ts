import type {
  OperationPathParams,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'
import useAnalysisSubjectValidation from '~/composables/validation/shared/useAnalysisSubjectValidation'

const analysisSubjectRules = useAnalysisSubjectValidation(
  '/api/validator/unique/analyses/botany/charcoals',
)

export function useCreateValidation(
  parent?: ResourceParent<'botanyCharcoal'> | ResourceParent<'analysis'>,
) {
  type RequestBody =
    PostCollectionRequestMap['/api/data/analyses/botany/charcoals']

  const { key: parentKey, iri: parentIri } = useResourceParent(parent)
  const getEmptyModel = () =>
    ({
      subject:
        parentKey.value === 'botanyCharcoal' ? parentIri.value : undefined,
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
    | OperationPathParams<'/api/data/analyses/botany/charcoals/{id}', 'get'>
    | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/analyses/botany/charcoals/{id}',
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
