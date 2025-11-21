<script setup lang="ts" generic="Path extends GetCollectionPath">
import type { CollectionAcl, GetCollectionPath } from '~~/types'

const props = withDefaults(
  defineProps<{
    path: Path
    title?: string
    showBackButton?: boolean
    acl: CollectionAcl | false
    parent: boolean
  }>(),
  {
    showBackButton: true,
  },
)

defineSlots<{
  default(): any
  dialogs(): any
  'search-bar'(): any
  'collection-actions'(): any
}>()

const { labels } = useResourceConfig(props.path)
const title = computed(() => props.title || labels[1])
</script>

<template>
  <data-card :title :show-back-button :parent>
    <template #toolbar-append>
      <slot name="search-bar" />
      <data-toolbar-collection-action-menu v-if="acl" :acl :path>
        <slot name="collection-actions">
          <!--          <data-toolbar-list-item-create v-if="acl.canCreate" :path />-->
        </slot>
      </data-toolbar-collection-action-menu>
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
