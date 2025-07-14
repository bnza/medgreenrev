<script setup lang="ts">
import type { BaseAcl } from '~~/types'

defineProps<{
  appPath: string
  id: string | number
  acl: BaseAcl
}>()
defineEmits<{
  (e: 'delete'): void
  (e: 'update'): void
}>()
defineSlots<{
  prepend(): any
  append(): any
}>()
</script>

<template>
  <v-btn-group variant="text" rounded="lg" class="item-nav">
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
</template>
