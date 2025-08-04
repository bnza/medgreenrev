import type { PostCollectionRequestMap, ResourceParent } from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { required } from '@regle/rules'
import useResourceParent from '~/composables/useResourceParent'

const uniqueContext = useApiUniqueValidator(
  '/api/validator/unique/context_stratigraphic_units/{context}/{stratigraphicUnit}',
  ['context', 'stratigraphicUnit'],
  'Duplicate [context, stratigraphic unit] combination',
)
const uniqueStratigraphicUnit = useApiUniqueValidator(
  '/api/validator/unique/context_stratigraphic_units/{context}/{stratigraphicUnit}',
  ['stratigraphicUnit', 'context'],
  'Duplicate [context, stratigraphic unit] combination',
)

export function useCreateValidation(
  parent?:
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
    | ResourceParent<'context', '/api/data/contexts/{id}'>,
) {
  const { key: parentKey, iri: parentIri } = useResourceParent(parent)

  type RequestBody =
    PostCollectionRequestMap['/api/data/context_stratigraphic_units']
  const getEmptyModel = () =>
    ({
      context: parentKey.value === 'context' ? parentIri.value : undefined,
      stratigraphicUnit:
        parentKey.value === 'stratigraphicUnit' ? parentIri.value : undefined,
    }) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      context: {
        required,
        uniqueContext: uniqueContext(() => model.value.stratigraphicUnit),
      },
      stratigraphicUnit: {
        required,
        uniqueStratigraphicUnit: uniqueStratigraphicUnit(
          () => model.value.context,
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
