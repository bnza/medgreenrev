<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/admin/users'>"
>
import type { CollectionAcl, GetCollectionPath } from '~~/types'
import { ApiSpecialistRole } from '~/utils/consts/auth'
import { getRoleColor, getRoleLabel } from '~/utils/acl'

const props = defineProps<{
  path: Path
}>()

const { appPath } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/admin/users/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/admin/users/{id}'),
)
const { isCurrentUser } = useAppAuth()
const { userData } = storeToRefs(useUserPasswordDialog())

const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>

<template>
  <data-collection-table :path @acl="acl = { ...acl, ...$event }">
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
    <template #[`item.role`]="{ item }">
      <p class="role-item">
        <v-icon icon="fas fa-user" :color="getRoleColor(item.roles)" />
        <span class="pl-2">{{ getRoleLabel(reduceAppRoles(item.roles)) }}</span>
      </p>
    </template>
    <template #[`item.enabled`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.enabled"
        readonly
        color="secondary"
      />
    </template>
    <template #[`item.anthropologist`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.roles"
        readonly
        :value="ApiSpecialistRole.Anthropologist"
      />
    </template>
    <template #[`item.archaoeobotanist`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.roles"
        readonly
        :value="ApiSpecialistRole.Archaeobotanist"
      />
    </template>
    <template #[`item.ceramic_specialist`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.roles"
        readonly
        :value="ApiSpecialistRole.CeramicSpecialist"
      />
    </template>
    <template #[`item.geo_archaeologist`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.roles"
        readonly
        :value="ApiSpecialistRole.GeoArchaeologist"
      />
    </template>
    <template #[`item.historian`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.roles"
        readonly
        :value="ApiSpecialistRole.Historian"
      />
    </template>
    <template #[`item.material_analyst`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.roles"
        readonly
        :value="ApiSpecialistRole.MaterialAnalyst"
      />
    </template>
    <template #[`item.paleoclimatologist`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.roles"
        readonly
        :value="ApiSpecialistRole.PaleoClimatologist"
      />
    </template>
    <template #[`item.zoo_archaeologist`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.roles"
        readonly
        :value="ApiSpecialistRole.ZooArchaeologist"
      />
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-create-user :path @refresh="refetch()" />
      <data-dialog-delete-user @refresh="refetch()" />
      <data-dialog-update-user @refresh="refetch()" />
      <data-dialog-user-password mode="reset" />
    </template>
  </data-collection-table>
</template>

<style scoped>
.centered-item {
  margin: 0 auto;
  display: block;
}

.role-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
</style>
