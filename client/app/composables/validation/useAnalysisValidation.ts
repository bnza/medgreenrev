import type { OperationPathParams, PostCollectionRequestMap } from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { required } from '@regle/rules'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'

const uniqueType = useApiUniqueValidator(
  '/api/validator/unique/analyses',
  ['type', 'identifier'],
  'Duplicate [type, identifier] combination',
)
const uniqueIdentifier = useApiUniqueValidator(
  '/api/validator/unique/analyses',
  ['identifier', 'type'],
  'Duplicate [type, identifier] combination',
)
export function useCreateValidation() {
  type RequestBody = PostCollectionRequestMap['/api/data/analyses']
  const getEmptyModel = () => ({}) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      type: { required, uniqueType: uniqueType(() => model.value.identifier) },
      identifier: {
        required,
        uniqueIdentifier: uniqueIdentifier(() => model.value.type),
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
    OperationPathParams<'/api/data/analyses/{id}', 'get'> | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/analyses/{id}',
    params,
  )

  const typeChanged = computed(() => item.value.type !== model.value.type)
  const identifierChanged = computed(
    () => item.value.identifier !== model.value.identifier,
  )

  const rules = computed(() => {
    const baseRules = {
      type: {
        required,
        // Conditionally add uniqueSite validation only when site has changed
        // Using spread operator to dynamically include async validators and avoid applyIf issues
        ...(typeChanged.value
          ? {
              uniqueType: uniqueType(() => model.value.identifier),
            }
          : {}),
      },
      identifier: {
        required,
        // Conditionally add uniqueName validation only when name has changed
        // Using spread operator to dynamically build validation rules
        ...(identifierChanged.value
          ? {
              uniqueIdentifier: uniqueIdentifier(() => model.value.type),
            }
          : {}),
      },
    }

    return inferRules(model, baseRules)
  })

  const { r$ } = useRegle(model, rules)

  return {
    responseItem,
    item,
    r$,
  }
}
