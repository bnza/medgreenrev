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
  ApiResourceKey,
  GetCollectionPath,
  ResourceParentSiteUserPrivilege,
} from '~~/types'

import useResourceUiStore from '~/stores/resource-ui'

const resourceKey = 'siteUserPrivilege' as ApiResourceKey

const props = defineProps<{
  path: Path
  parent?: ResourceParentSiteUserPrivilege
}>()

const { id: parentId } = useResourceParent(props.parent)
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
      <auth-sites-user-privilege-button
        :privilege="item.privilege"
        @click="updateDialogState = { id: item.id }"
      />
    </template>
    <template #dialogs>
      <data-dialog-delete-site-user-privilege />
      <data-dialog-create-site-user-privilege :path :parent />
      <data-dialog-update-site-user-privileges />
    </template>
  </data-collection-table>
</template>
