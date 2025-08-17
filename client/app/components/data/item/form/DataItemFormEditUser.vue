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

defineProps<Props>()

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
</script>

<template>
  <v-row>
    <v-text-field
      v-model="item.email"
      label="email"
      :disabled="mode === 'update'"
      :error-messages="errors?.email"
    />
  </v-row>
  <v-row>
    <v-col data-cy="roles-input-col" cols="3">
      <v-radio-group
        v-model="role"
        :error-messages="flattenRegleErrors(errors?.roles)"
      >
        <v-radio label="administrator" color="error" :value="ApiRole.Admin" />
        <v-radio label="editor" color="warning" :value="ApiRole.Editor" />
        <v-radio label="user" color="success" :value="ApiRole.User" />
      </v-radio-group>
    </v-col>
    <v-col data-testid="spec-roles-input-col">
      <v-checkbox
        v-model="item.roles"
        label="geo archeologist"
        color="primary"
        :value="ApiSpecialistRole.GeoArchaeologist"
      />
      <v-checkbox
        v-model="item.roles"
        label="ceramic specialist"
        color="primary"
        :value="ApiSpecialistRole.CeramicSpecialist"
      />
      <v-checkbox
        v-model="item.roles"
        label="zoo archaeologist"
        color="primary"
        :value="ApiSpecialistRole.ZooArchaeologist"
      />
    </v-col>
  </v-row>
</template>
