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
import { useRegle } from '@regle/core'
import { required } from '@regle/rules'

import useResourceParent from '~/composables/useResourceParent'

const props = defineProps<{
  path: Path
  parent?: ResourceParentSiteUserPrivilege
}>()

type RequestBody = PostCollectionRequestMap['/api/site_user_privileges']
const { key: parentKey, iri: parentIri } = useResourceParent(props.parent)

const getEmptyModel = () =>
  ({
    user: parentKey.value === 'user' ? parentIri.value : undefined,
    site: parentKey.value === 'site' ? parentIri.value : undefined,
    privilege: 0,
  }) as unknown as RequestBody & {
    user: Record<string, any> | undefined
    site: Record<string, any> | undefined
  }

const { r$ } = useRegle(getEmptyModel(), {
  site: {
    required,
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
