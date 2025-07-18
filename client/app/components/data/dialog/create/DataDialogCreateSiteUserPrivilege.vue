<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/site_user_privileges'
      | '/api/sites/{parentId}/site_user_privileges'
      | '/api/users/{parentId}/site_user_privileges'
    >
  "
>
import type {
  GetCollectionPath,
  PostCollectionRequestMap,
  ResourceParentSiteUserPrivilege,
} from '~~/types'
import { createRule, type Maybe, useRegle } from '@regle/core'
import { required, isFilled } from '@regle/rules'

import useResourceParent from '~/composables/useResourceParent'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import { extractIdFromIri } from '~/utils'

const props = defineProps<{
  path: Path
  parent?: ResourceParentSiteUserPrivilege
}>()

const { key: parentKey, iri: parentIri } = useResourceParent(props.parent)

const getEmptyModel = () => ({
  user: parentKey.value === 'user' ? parentIri.value : undefined,
  site: parentKey.value === 'site' ? parentIri.value : undefined,
  privilege: 0,
})

const apiValidator = new GetValidationOperation(
  '/api/validator/unique/site_user_privileges/{site}/{user}',
)

const uniqueSite = createRule({
  async validator(site: Maybe<string>, user: Maybe<string>) {
    if (!isFilled(site)) return true
    site = extractIdFromIri(site)
    if (!site) {
      console.error('Invalid site IRI: ', site)
      return false
    }
    if (!isFilled(user)) return true
    user = extractIdFromIri(user)
    if (!user) {
      console.error('Invalid user IRI: ', site)
      return false
    }
    return await apiValidator.isValid({
      site,
      user,
    })
  },
  message: 'Duplicate [site, user] combination',
})

const model = reactive(getEmptyModel())

const { r$ } = useRegle(model, {
  site: {
    required,
    uniqueUser: uniqueSite(() => model.user),
  },
  user: {
    required,
  },
})
const onPreSubmit = (item: any) => {
  if ('privilege' in item) item.privilege = Number(item.privilege)
  return item
}
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    title="User"
    :path
    :redirect-option="false"
    :on-pre-submit
    :get-empty-model
  >
    <template #default>
      <data-item-form-edit-site-user-privilege
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
