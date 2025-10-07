<script setup lang="ts" generic="Path extends GetCollectionPath">
import type { CollectionAcl, GetCollectionPath } from '~~/types'

const props = withDefaults(
  defineProps<{
    path: Path
    title?: string
    showBackButton?: boolean
    acl: CollectionAcl
    parent: boolean
  }>(),
  {
    showBackButton: true,
  },
)

defineSlots<{
  default(): any
  dialogs(): any
}>()

const { labels } = useResourceConfig(props.path)
const title = computed(() => props.title || labels[1])
</script>

<template>
  <data-card :title :show-back-button :parent>
    <template #toolbar-append>
      <data-toolbar-collection-action-menu :acl :path />
    </template>
    <template #default>
      <Suspense suspensible>
        <template #default>
          <slot />
        </template>
        <template #fallback>
          <loading-component />
        </template>
      </Suspense>
    </template>
    <template #append>
      <slot name="dialogs" />
    </template>
  </data-card>
</template>
