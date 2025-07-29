import type {
  OperationPathParams,
  ResourceParentSiteUserPrivilege,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { required } from '@regle/rules'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'
import useResourceParent from '~/composables/useResourceParent'

const uniqueSite = useApiUniqueValidator(
  '/api/validator/unique/site_user_privileges/{site}/{user}',
  ['site', 'user'],
  'Duplicate [site, user] combination',
)

const uniqueUser = useApiUniqueValidator(
  '/api/validator/unique/site_user_privileges/{site}/{user}',
  ['user', 'site'],
  'Duplicate [site, user] combination',
)

export function useCreateValidation(parent?: ResourceParentSiteUserPrivilege) {
  const { key: parentKey, iri: parentIri } = useResourceParent(parent)

  const getEmptyModel = () => ({
    user: parentKey.value === 'user' ? parentIri.value : undefined,
    site: parentKey.value === 'site' ? parentIri.value : undefined,
    privilege: 0,
  })

  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      site: {
        required,
        uniqueSite: uniqueSite(() => model.value.user),
      },
      user: {
        required,
        uniqueUser: uniqueUser(() => model.value.site),
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
    OperationPathParams<'/api/site_user_privileges/{id}', 'get'> | undefined
  >,
) {
  const { item, model, responseItem } = useGetPatchItemQuery(
    '/api/site_user_privileges/{id}',
    params,
  )

  const rules = computed(() =>
    inferRules(model, {
      privilege: { required },
    }),
  )

  const { r$ } = useRegle(model, rules)

  return {
    responseItem,
    item,
    r$,
  }
}
