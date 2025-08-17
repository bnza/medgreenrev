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
      <v-col cols="12" xs="6" sm="4" class="px-2">
        <v-text-field :model-value="item.email" label="email" />
      </v-col>
      <v-col data-testid="roles-input-col">
        <v-radio-group :model-value="role">
          <v-radio label="administrator" color="error" :value="ApiRole.Admin" />
          <v-radio label="editor" color="warning" :value="ApiRole.Editor" />
          <v-radio label="user" color="success" :value="ApiRole.User" />
        </v-radio-group>
      </v-col>
      <v-col data-testid="spec-roles-input-col">
        <v-checkbox
          :model-value="item.roles"
          label="geo archeologist"
          color="primary"
          :value="ApiSpecialistRole.GeoArchaeologist"
        />
        <v-checkbox
          :model-value="item.roles"
          label="ceramic specialist"
          color="primary"
          :value="ApiSpecialistRole.CeramicSpecialist"
        />
        <v-checkbox
          :model-value="item.roles"
          label="zoo archaeologist"
          color="primary"
          :value="ApiSpecialistRole.ZooArchaeologist"
        />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
