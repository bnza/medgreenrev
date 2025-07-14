import type { RegleComputedRules } from '@regle/core'
import { required, email, minLength } from '@regle/rules'
import type { ValidationRequestBody } from '~~/types'

export const create = computed(
  () =>
    ({
      email: { required, email },
      roles: { required, minLength: minLength(1) },
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
