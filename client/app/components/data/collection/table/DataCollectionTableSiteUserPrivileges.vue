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
import type { ApiResourceKey, GetCollectionPath } from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'

const resourceKey = 'siteUserPrivilege' as ApiResourceKey

const props = defineProps<{
  path: Path
  parentId?: string
}>()

const appPath = getApiResourceConfig(resourceKey).appPath
const { deleteDialogState, updateDialogState } = storeToRefs(
  useResourceUiStore(props.path),
)
</script>

<template>
  <data-collection-table :path :parent-id>
    <template #[`item.id`]="{ item }">
      <navigation-resource-item
        :id="item.id"
        :acl="item._acl"
        :app-path
        @delete="deleteDialogState = { id: item.id }"
        @update="updateDialogState = { id: item.id }"
      />
    </template>
    <template #dialogs>
      <data-dialog-search-site :path />
      <data-dialog-create-site :path />
      <data-dialog-delete-site />
      <data-dialog-update-site />
    </template>
  </data-collection-table>
</template>
