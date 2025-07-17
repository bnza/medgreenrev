<script setup lang="ts" generic="Path extends GetCollectionPath">
import type { GetCollectionPath } from '~~/types'

withDefaults(
  defineProps<{
    path: Path
    title: string
    showBackButton?: boolean
  }>(),
  {
    showBackButton: true,
  },
)

defineSlots<{
  default(): any
  dialogs(): any
}>()

const { siteCollectionAcl } = useAppAuth()
</script>

<template>
  <data-card :title :show-back-button>
    <template #toolbar-append>
      <data-toolbar-collection-action-menu :acl="siteCollectionAcl" :path />
    </template>
    <template #default>
      <slot />
    </template>
    <template #append>
      <slot name="dialogs" />
    </template>
  </data-card>
</template>
