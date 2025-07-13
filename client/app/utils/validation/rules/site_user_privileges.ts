import type { RegleComputedRules } from '@regle/core'
import type { ValidationRequestBody } from '~~/types'
import { required } from '@regle/rules'

export const create = computed(
  () =>
    ({
      user: { required },
    }) satisfies RegleComputedRules<
      ValidationRequestBody<'create', '/api/site_user_privileges'>
    >,
)

export const update = computed(
  () =>
    ({
      privilege: { required },
    }) satisfies RegleComputedRules<
      ValidationRequestBody<'update', '/api/site_user_privileges/{id}'>
    >,
)

export default {
  create,
  update,
}
