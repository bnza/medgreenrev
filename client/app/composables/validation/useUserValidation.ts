import type { OperationPathParams, PostCollectionRequestMap } from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { email, minLength, required } from '@regle/rules'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'

export function useCreateValidation() {
  type RequestBody = PostCollectionRequestMap['/api/admin/users']
  const getEmptyModel = () =>
    ({
      roles: [] as string[],
    }) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      email: { required, email },
      roles: { required, minLength: minLength(1) },
    }),
  )
  const { r$ } = useRegle(model, rules)

  return {
    getEmptyModel,
    r$,
  }
}

export function useUpdateValidation(
  params: Ref<OperationPathParams<'/api/admin/users/{id}', 'get'> | undefined>,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/admin/users/{id}',
    params,
  )

  const rules = computed(() =>
    inferRules(model, {
      roles: { required },
    }),
  )

  const { r$ } = useRegle(model, rules)
  return {
    responseItem,
    item,
    r$,
  }
}
