<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/users'>"
>
import type { GetCollectionPath } from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'

const resourceKey = 'user'

defineProps<{
  path: Path
}>()

const appPath = getApiResourceConfig(resourceKey).appPath
const { deleteDialogState, updateDialogState } = storeToRefs(
  useResourceUiStore('/api/users/{id}'),
)
const { isCurrentUser } = useAppAuth()
const { userData } = storeToRefs(userPasswordDialog())
</script>

<template>
  <data-collection-table :path>
    <template #[`item.id`]="{ item }">
      <navigation-resource-item
        :id="item.id"
        :acl="item._acl"
        :app-path
        @delete="deleteDialogState = { id: item.id }"
        @update="updateDialogState = { id: item.id }"
      >
        <template #prepend>
          <navigation-resource-reset-password
            :id="item.id"
            :disabled="isCurrentUser(item.email)"
            @reset-password="userData = item"
          />
        </template>
      </navigation-resource-item>
    </template>
    <template #dialogs>
      <data-dialog-search-user :path />
      <data-dialog-create-user :path />
      <data-dialog-delete-user />
      <data-dialog-update-user />
      <data-dialog-user-password mode="reset" />
    </template>
  </data-collection-table>
</template>
