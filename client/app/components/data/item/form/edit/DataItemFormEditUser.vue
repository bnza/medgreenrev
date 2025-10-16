<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import { ApiRole, ApiSpecialistRole } from '~/utils/consts/auth'
import { mergeRole } from '~/utils/acl'
import type { PatchItemRequestMap, PostCollectionRequestMap } from '~~/types'

type Item = PostCollectionRequestMap['/api/admin/users'] &
  PatchItemRequestMap['/api/admin/users/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
}

const props = defineProps<Props>()

const role = computed({
  get() {
    return item.value.roles ? reduceAppRoles(item.value.roles) : ApiRole.User
  },
  set(value: ApiRole) {
    item.value.roles = mergeRole(
      value,
      item.value.roles as (ApiRole | ApiSpecialistRole)[],
    )
  },
})

if (props.mode === 'create') {
  item.value.enabled = true
}
</script>

<template>
  <v-row>
    <v-col cols="8">
      <v-text-field
        v-model="item.email"
        label="email"
        :disabled="mode === 'update'"
        :error-messages="errors?.email"
      />
    </v-col>
    <v-col cols="4">
      <v-checkbox
        v-model="item.enabled"
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
        :error-messages="flattenRegleErrors(errors?.roles)"
      >
        <v-radio label="administrator" color="error" :value="ApiRole.Admin" />
        <v-radio label="editor" color="warning" :value="ApiRole.Editor" />
        <v-radio label="user" color="success" :value="ApiRole.User" />
      </v-radio-group>
    </v-col>
    <v-col cols="4">
      <v-checkbox
        v-model="item.roles"
        label="anthropologist"
        color="primary"
        :value="ApiSpecialistRole.Anthropologist"
        density="compact"
      />
      <v-checkbox
        v-model="item.roles"
        label="archaeobotanist"
        color="primary"
        :value="ApiSpecialistRole.Archaeobotanist"
        density="compact"
      />
      <v-checkbox
        v-model="item.roles"
        label="ceramic specialist"
        color="primary"
        :value="ApiSpecialistRole.CeramicSpecialist"
        density="compact"
      />
      <v-checkbox
        v-model="item.roles"
        label="geo archeologist"
        color="primary"
        :value="ApiSpecialistRole.GeoArchaeologist"
        density="compact"
      />
    </v-col>
    <v-col cols="4">
      <v-checkbox
        v-model="item.roles"
        label="historian"
        color="primary"
        :value="ApiSpecialistRole.Historian"
        density="compact"
      />
      <v-checkbox
        v-model="item.roles"
        label="material analyst"
        color="primary"
        :value="ApiSpecialistRole.MaterialAnalyst"
        density="compact"
      />
      <v-checkbox
        v-model="item.roles"
        label="paleoclimatologist"
        color="primary"
        :value="ApiSpecialistRole.PaleoClimatologist"
        density="compact"
      />
      <v-checkbox
        v-model="item.roles"
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
