import type { RegleComputedRules } from '@regle/core'
import { required } from '@regle/rules'
import type { ValidationRequestBody } from '~~/types'

export const create = computed(
  () =>
    ({
      email: { required },
      roles: { required },
    }) satisfies RegleComputedRules<
      Partial<ValidationRequestBody<'create', '/api/users'>>
    >,
)

export const update = computed(
  () =>
    ({
      roles: { required },
    }) satisfies RegleComputedRules<
      Partial<ValidationRequestBody<'create', '/api/users'>>
    >,
)

export default {
  create,
  update,
}
