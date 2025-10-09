import type {
  PostCollectionRequestMap,
  OperationPathParams,
  ResourceParent,
} from '~~/types'
import { createRule, inferRules, type Maybe, useRegle } from '@regle/core'
import { required } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import useResourceParent from '~/composables/useResourceParent'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'

const apiIdentifierValidator = new GetValidationOperation(
  '/api/validator/unique/individuals/identifier',
)

const uniqueIdentifier = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiIdentifierValidator.isValid({ identifier: value }) : true,
  message: 'Identifier must be unique',
})

export function useCreateValidation(
  parent?: ResourceParent<'stratigraphicUnit'>,
) {
  type RequestBody = PostCollectionRequestMap['/api/data/individuals']

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
      },
      identifier: {
        required,
        unique: uniqueIdentifier,
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
    OperationPathParams<'/api/data/individuals/{id}', 'get'> | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/individuals/{id}',
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
