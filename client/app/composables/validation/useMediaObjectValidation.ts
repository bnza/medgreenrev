import type { OperationPathParams } from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { required } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'

const apiInventoryValidator = new GetValidationOperation(
  '/api/validator/unique/potteries/inventory/{id}',
)

export function useCreateValidation() {
  // type RequestBody = PostCollectionRequestMap['/api/data/media_objects']

  type MediaObjectFields = {
    file: File | null
    type: string | null
    description?: string | null
  }

  const getEmptyModel = () =>
    ({
      file: null,
      type: null,
    }) as MediaObjectFields

  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      type: {
        required,
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
    OperationPathParams<'/api/data/media_objects/{id}', 'get'> | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/media_objects/{id}',
    params,
  )

  const rules = computed(() =>
    inferRules(model, {
      type: {
        required,
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
