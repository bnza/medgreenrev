import type {
  OperationPathParams,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { required } from '@regle/rules'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'
import useResourceParent from '~/composables/useResourceParent'

const uniqueSubject = useApiUniqueValidator(
  '/api/validator/unique/analyses/potteries/{analysis}/{subject}',
  ['subject', 'analysis'],
  'Duplicate [subject, analysis] combination',
)
const uniqueAnalysis = useApiUniqueValidator(
  '/api/validator/unique/analyses/potteries/{analysis}/{subject}',
  ['analysis', 'subject'],
  'Duplicate [subject, analysis] combination',
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
    inferRules(model, {
      subject: {
        required,
        unique: uniqueSubject(() => model.value.analysis),
      },
      analysis: {
        required,
        unique: uniqueAnalysis(() => model.value.subject),
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
