<script setup lang="ts">
import type { BaseAcl } from '~~/types'

defineProps<{
  appPath: string
  id: string | number
  acl?: BaseAcl
}>()
defineEmits<{
  delete: []
  update: []
}>()
defineSlots<{
  prepend(): any
  append(): any
}>()
</script>

<template>
  <v-btn-group v-if="acl">
    <slot name="prepend" />
    <navigation-resource-item-read :id :app-path :disabled="!acl.canRead" />
    <navigation-resource-item-update
      :disabled="!acl.canUpdate"
      @update="$emit('update')"
    />
    <navigation-resource-item-delete
      :disabled="!acl.canDelete"
      @delete="$emit('delete')"
    />
    <slot name="append" />
  </v-btn-group>
  <v-btn-group v-else>
    <v-btn
      density="compact"
      icon
      variant="text"
      data-testid="update-item-button"
    >
      <v-icon color="error" icon="far fa-circle-xmark" size="small" />
      <v-tooltip activator="parent" location="bottom"
        >ACL not provided. Contact your system admin</v-tooltip
      >
    </v-btn>
  </v-btn-group>
</template>
