import type {
  OperationPathParams,
  ResourceParent,
  ApiResourceKey,
  GetItemPath,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { required } from '@regle/rules'
import { capitalize } from 'vue'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'
import useAnalysisSubjectValidationRules from '~/composables/validation/shared/useAnalysisSubjectValidation'
import type { AnalysisSubjectValidationPath } from '~/composables/validation/shared/useAnalysisSubjectValidation'
import { API_RESOURCE_MAP } from '~/utils/consts/resources'

type SubjectKey = Extract<
  ApiResourceKey,
  | 'botanyCharcoal'
  | 'botanySeed'
  | 'individual'
  | 'pottery'
  | 'zooBone'
  | 'zooTooth'
>
type GetItemPaths = Extract<
  GetItemPath,
  | '/api/data/analyses/botany/charcoals/{id}'
  | '/api/data/analyses/botany/seeds/{id}'
  | '/api/data/analyses/individuals/{id}'
  | '/api/data/analyses/potteries/{id}'
  | '/api/data/analyses/zoo/bones/{id}'
  | '/api/data/analyses/zoo/teeth/{id}'
>

interface UseAnalysisSubjectValidationConfig<
  TSubjectKey extends SubjectKey,
  // TGetPath extends GetItemPaths,
> {
  validatorPath: AnalysisSubjectValidationPath
  // getPath: TGetPath
  subjectKey: TSubjectKey
  includeGroups?: ApiResourceKey[]
}

export function useAnalysisSubjectValidation<
  TSubjectKey extends SubjectKey,
  // TGetPath extends GetItemPaths,
>(
  config: UseAnalysisSubjectValidationConfig<TSubjectKey>,
  //  , TGetPath
) {
  const analysisSubjectRules = useAnalysisSubjectValidationRules(
    config.validatorPath,
  )

  type ParentKey = TSubjectKey | 'analysis'

  function useCreateValidation(parent?: ResourceParent<ParentKey>) {
    type RequestBody = {
      analysis?: string | undefined
      subject?: string | undefined
      summary: string | null
    }

    const { key: parentKey, iri: parentIri } = useResourceParent(parent)
    const getEmptyModel = () =>
      ({
        subject:
          parentKey.value === config.subjectKey ? parentIri.value : undefined,
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

  function useUpdateValidation(
    params: Ref<OperationPathParams<typeof getItemPath, 'get'> | undefined>,
  ) {
    const analysisSubjectKey = 'analysis' + capitalize(config.subjectKey)

    if (!isApiResourceKey(analysisSubjectKey)) {
      throw new Error('Invalid analysis subject key')
    }

    const getItemPath = (API_RESOURCE_MAP[analysisSubjectKey] +
      '/{id}') as GetItemPaths

    const absDatingAnalysisSubjectKey =
      'absDating' + capitalize(analysisSubjectKey)

    const blackList = isApiResourceKey(absDatingAnalysisSubjectKey)
      ? [absDatingAnalysisSubjectKey]
      : []

    const { item, responseItem, model } = useGetPatchItemQuery(
      getItemPath,
      params,
      blackList,
    )

    // Type annotation to help TypeScript infer the model type correctly for Regle
    type ModelType = {
      subject?: string
      analysis?: string
      summary?: string | null
    }

    const rules = computed(() =>
      inferRules(model as Ref<ModelType>, {
        subject: {
          required,
        },
        analysis: {
          required,
        },
      }),
    )

    const { r$ } = useRegle(model as Ref<ModelType>, rules)
    return {
      responseItem,
      item,
      r$,
    }
  }

  return {
    useCreateValidation,
    useUpdateValidation,
  }
}
