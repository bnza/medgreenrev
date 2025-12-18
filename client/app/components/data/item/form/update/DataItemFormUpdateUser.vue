<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { required } from '@regle/rules'
import { ApiRole, ApiSpecialistRole } from '~/utils/consts/auth'
import { mergeRole } from '~/utils/acl'

type Path = '/api/admin/users/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {
  roles: { required },
})

const role = computed({
  get() {
    return reduceAppRoles(r$.$value.roles)
  },
  set(value: ApiRole) {
    r$.$value.roles = mergeRole(
      value,
      r$.$value.roles as (ApiRole | ApiSpecialistRole)[],
    )
  },
})
</script>

<template>
  <v-row>
    <v-col cols="8">
      <v-text-field
        :model-value="props.fetchedItem?.email"
        label="email"
        disabled
      />
    </v-col>
    <v-col cols="4">
      <v-checkbox
        v-model="r$.$value.enabled"
        label="enabled"
        color="secondary"
        density="compact"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col data-cy="roles-input-col" cols="4">
      <v-radio-group
        v-model="role"
        :error-messages="flattenRegleErrors(r$.$errors?.roles)"
      >
        <v-radio label="administrator" color="error" :value="ApiRole.Admin" />
        <v-radio label="editor" color="warning" :value="ApiRole.Editor" />
        <v-radio label="user" color="success" :value="ApiRole.User" />
      </v-radio-group>
    </v-col>
    <v-col cols="4">
      <v-checkbox
        v-model="r$.$value.roles"
        label="anthropologist"
        color="primary"
        :value="ApiSpecialistRole.Anthropologist"
        density="compact"
      />
      <v-checkbox
        v-model="r$.$value.roles"
        label="archaeobotanist"
        color="primary"
        :value="ApiSpecialistRole.Archaeobotanist"
        density="compact"
      />
      <v-checkbox
        v-model="r$.$value.roles"
        label="ceramic specialist"
        color="primary"
        :value="ApiSpecialistRole.CeramicSpecialist"
        density="compact"
      />
      <v-checkbox
        v-model="r$.$value.roles"
        label="geo archeologist"
        color="primary"
        :value="ApiSpecialistRole.GeoArchaeologist"
        density="compact"
      />
    </v-col>
    <v-col cols="4">
      <v-checkbox
        v-model="r$.$value.roles"
        label="historian"
        color="primary"
        :value="ApiSpecialistRole.Historian"
        density="compact"
      />
      <v-checkbox
        v-model="r$.$value.roles"
        label="material analyst"
        color="primary"
        :value="ApiSpecialistRole.MaterialAnalyst"
        density="compact"
      />
      <v-checkbox
        v-model="r$.$value.roles"
        label="paleoclimatologist"
        color="primary"
        :value="ApiSpecialistRole.PaleoClimatologist"
        density="compact"
      />
      <v-checkbox
        v-model="r$.$value.roles"
        label="zoo archaeologist"
        color="primary"
        :value="ApiSpecialistRole.ZooArchaeologist"
        density="compact"
      />
    </v-col>
  </v-row>
</template>

<style scoped>
.v-checkbox ::v-deep(label) {
  padding-left: 1rem;
}
</style>
