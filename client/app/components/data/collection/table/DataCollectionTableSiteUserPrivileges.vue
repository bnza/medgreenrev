<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/sites/{parentId}/site_user_privileges'
      | '/api/users/{parentId}/site_user_privileges'
    >
  "
>
import type { ApiResourceKey, GetCollectionPath } from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'

const resourceKey = 'siteUserPrivilege' as ApiResourceKey

defineProps<{
  path: Path
  parentId?: string
}>()

const appPath = getApiResourceConfig(resourceKey).appPath

const { deleteDialogState, updateDialogState } = storeToRefs(
  useResourceUiStore('/api/site_user_privileges/{id}'),
)
</script>

<template>
  <data-collection-table :path :parent-id>
    <template #[`item.id`]="{ item }">
      <v-btn-group>
        <navigation-resource-item-delete
          :id="item.id"
          :acl="item._acl"
          :app-path
          @delete="deleteDialogState = { id: item.id }"
        />
      </v-btn-group>
    </template>
    <template #[`item.privilege`]="{ item }">
      <auth-sites-user-privilege-button :privilege="item.privilege" />
    </template>
    <template #dialogs>
      <data-dialog-delete-site-user-privilege />
    </template>
  </data-collection-table>
</template>
