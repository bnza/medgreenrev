import type {
  PostCollectionRequestMap,
  OperationPathParams,
  ResourceParent,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { required } from '@regle/rules'
import useResourceParent from '~/composables/useResourceParent'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'

const uniqueStratigraphicUnit = useApiUniqueValidator(
  '/api/validator/unique/microstratigraphic_units',
  ['stratigraphicUnit', 'identifier'],
  'Duplicate [stratigraphic unit, identifier] combination',
)

const uniqueIdentifier = useApiUniqueValidator(
  '/api/validator/unique/microstratigraphic_units',
  ['identifier', 'stratigraphicUnit'],
  'Duplicate [stratigraphic unit, identifier] combination',
)

export function useCreateValidation(
  parent?: ResourceParent<'stratigraphicUnit'>,
) {
  type RequestBody =
    PostCollectionRequestMap['/api/data/microstratigraphic_units']

  const { key: parentKey, iri: parentIri } = useResourceParent(parent)
  const getEmptyModel = () =>
    ({
      stratigraphicUnit:
        parentKey.value === 'stratigraphicUnit' ? parentIri.value : undefined,
    }) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      stratigraphicUnit: {
        required,
        unique: uniqueStratigraphicUnit(() => model.value.identifier),
      },
      identifier: {
        required,
        unique: uniqueIdentifier(() => model.value.stratigraphicUnit),
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
    | OperationPathParams<'/api/data/microstratigraphic_units/{id}', 'get'>
    | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/microstratigraphic_units/{id}',
    params,
  )

  const identifierChanged = computed(
    () => item.value.identifier !== model.value.identifier,
  )

  const rules = computed(() =>
    inferRules(model, {
      stratigraphicUnit: {
        required,
      },
      identifier: {
        required,
        ...(identifierChanged.value
          ? {
              unique: uniqueIdentifier,
            }
          : {}),
      },
    }),
  )

  const { r$ } = useRegle(model, rules)
  return {
    responseItem,
    item,
    r$,
  }
}
