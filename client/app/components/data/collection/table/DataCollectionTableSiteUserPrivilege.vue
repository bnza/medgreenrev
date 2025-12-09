<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/admin/site_user_privileges'
      | '/api/admin/sites/{parentId}/site_user_privileges'
      | '/api/admin/users/{parentId}/site_user_privileges'
    >
  "
>
import type {
  CollectionAcl,
  GetCollectionPath,
  ResourceParentSiteUserPrivilege,
} from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParentSiteUserPrivilege
}>()

const { id: parentId } = useResourceParent(props.parent)

const { appPath } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/admin/site_user_privileges/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/admin/site_user_privileges/{id}'),
)

const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>

<template>
  <data-collection-table :path :parent-id @acl="acl = { ...acl, ...$event }">
    <template #[`item.id`]="{ item }">
      <v-btn-group>
        <navigation-resource-item-delete
          :id="item.id"
          :disabled="!item._acl.canDelete"
          :app-path
          @delete="deleteDialogState = { id: item.id }"
        />
      </v-btn-group>
    </template>
    <template #[`item.privilege`]="{ item }">
      <auth-sites-user-privilege-button
        :disabled="!item._acl.canUpdate"
        :privilege="item.privilege"
        @click="updateDialogState = { id: item.id }"
      />
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-site-user-privilege @refresh="refetch()" />
      <data-dialog-create-site-user-privilege
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-update-site-user-privileges @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
