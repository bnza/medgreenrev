<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import { ApiRole, type ApiSpecialistRole } from '~/utils/consts/auth'
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
  <v-col data-cy="roles-input-col">
    <v-radio-group
      v-model="role"
      :error-messages="flattenRegleErrors(errors?.roles)"
    >
      <v-radio label="ROLE_ADMIN" color="error" value="ROLE_ADMIN" />
      <v-radio label="ROLE_EDITOR" color="warning" value="ROLE_EDITOR" />
      <v-radio label="ROLE_USER" color="success" value="ROLE_USER" />
    </v-radio-group>
  </v-col>
</template>
