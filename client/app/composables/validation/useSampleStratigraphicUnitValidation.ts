import type { PostCollectionRequestMap, ResourceParent } from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { required } from '@regle/rules'

const uniqueStratigraphicUnit = useApiUniqueValidator(
  '/api/validator/unique/sample_stratigraphic_units/{sample}/{stratigraphicUnit}',
  ['stratigraphicUnit', 'sample'],
  'Duplicate [stratigraphic unit, sample] combination',
)
const uniqueSample = useApiUniqueValidator(
  '/api/validator/unique/sample_stratigraphic_units/{sample}/{stratigraphicUnit}',
  ['sample', 'stratigraphicUnit'],
  'Duplicate [stratigraphic unit, sample] combination',
)

export function useCreateValidation(
  parent?:
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
    | ResourceParent<'sample', '/api/data/samples/{id}'>,
) {
  const { key: parentKey, iri: parentIri } = useResourceParent(parent)
  type RequestBody =
    PostCollectionRequestMap['/api/data/sample_stratigraphic_units']

  const getEmptyModel = () =>
    ({
      stratigraphicUnit:
        parentKey.value === 'stratigraphicUnit' ? parentIri.value : undefined,
      sample: parentKey.value === 'sample' ? parentIri.value : undefined,
    }) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      sample: {
        required,
        uniqueSample: uniqueSample(() => model.value.stratigraphicUnit),
      },
      stratigraphicUnit: {
        required,
        uniqueStratigraphicUnit: uniqueStratigraphicUnit(
          () => model.value.sample,
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
