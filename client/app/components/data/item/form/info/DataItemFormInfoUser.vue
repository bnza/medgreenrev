<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'
import { ApiRole, ApiSpecialistRole } from '~/utils/consts/auth'

const props = defineProps<{
  item: GetItemResponseMap['/api/admin/users/{id}']
}>()

const role = computed(() => reduceAppRoles(props.item.roles))
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="8" class="px-2">
        <v-text-field :model-value="item.email" label="email" />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-checkbox
          :model-value="item.enabled"
          label="enabled"
          color="secondary"
          density="compact"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="px-2" data-testid="roles-input-col">
        <v-radio-group :model-value="role">
          <v-radio label="administrator" color="error" :value="ApiRole.Admin" />
          <v-radio label="editor" color="warning" :value="ApiRole.Editor" />
          <v-radio label="user" color="success" :value="ApiRole.User" />
        </v-radio-group>
      </v-col>
      <v-col cols="4" class="px-2">
        <v-checkbox
          :model-value="item.roles"
          label="anthropologist"
          color="primary"
          :value="ApiSpecialistRole.Anthropologist"
          density="compact"
        />
        <v-checkbox
          :model-value="item.roles"
          label="archaeobotanist"
          color="primary"
          :value="ApiSpecialistRole.Archaeobotanist"
          density="compact"
        />
        <v-checkbox
          :model-value="item.roles"
          label="ceramic specialist"
          color="primary"
          :value="ApiSpecialistRole.CeramicSpecialist"
          density="compact"
        />
        <v-checkbox
          :model-value="item.roles"
          label="geo archeologist"
          color="primary"
          :value="ApiSpecialistRole.GeoArchaeologist"
          density="compact"
        />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-checkbox
          :model-value="item.roles"
          label="historian"
          color="primary"
          :value="ApiSpecialistRole.Historian"
          density="compact"
        />
        <v-checkbox
          :model-value="item.roles"
          label="material analyst"
          color="primary"
          :value="ApiSpecialistRole.MaterialAnalyst"
          density="compact"
        />
        <v-checkbox
          :model-value="item.roles"
          label="paleoclimatologist"
          color="primary"
          :value="ApiSpecialistRole.PaleoClimatologist"
          density="compact"
        />
        <v-checkbox
          :model-value="item.roles"
          label="zoo archaeologist"
          color="primary"
          :value="ApiSpecialistRole.ZooArchaeologist"
          density="compact"
        />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>

<style scoped>
.v-checkbox ::v-deep(label) {
  padding-left: 1rem;
}
</style>
