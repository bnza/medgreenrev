import { computed, ref } from 'vue'
import { required } from '@regle/rules'
import { inferRules, useRegle } from '@regle/core'
import type { PostCollectionRequestMap, ResourceParent } from '~~/types'

const uniqueContext = useApiUniqueValidator(
  '/api/validator/unique/context_sample/{context}/{sample}',
  ['context', 'sample'],
  'Duplicate [context, sample] combination',
)
const uniqueSample = useApiUniqueValidator(
  '/api/validator/unique/context_sample/{context}/{sample}',
  ['sample', 'context'],
  'Duplicate [context, sample] combination',
)
export function useCreateValidation(
  parent?:
    | ResourceParent<'context', '/api/data/contexts/{id}'>
    | ResourceParent<'sample', '/api/data/samples/{id}'>,
) {
  const { key: parentKey, iri: parentIri } = useResourceParent(parent)

  type RequestBody = PostCollectionRequestMap['/api/data/context_samples']
  const getEmptyModel = () =>
    ({
      context: parentKey.value === 'context' ? parentIri.value : undefined,
      sample: parentKey.value === 'sample' ? parentIri.value : undefined,
    }) as RequestBody

  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      context: {
        required,
        uniqueContext: uniqueContext(() => model.value.sample),
      },
      sample: {
        required,
        uniqueSample: uniqueSample(() => model.value.context),
      },
    }),
  )

  const { r$ } = useRegle(model, rules)

  return {
    getEmptyModel,
    r$,
  }
}
