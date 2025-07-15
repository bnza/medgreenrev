<script setup lang="ts" generic="Path extends GetCollectionPath">
import type {
  GetCollectionPath,
  CollectionAcl,
  PostCollectionPath,
} from '~~/types'
import DataToolbarListItemCreate from '~/components/data/toolbar/DataToolbarListItemCreate.vue'

const props = defineProps<{
  acl: CollectionAcl
  path: Path
}>()
const { findApiResourcePath, isPostOperation } = useOpenApiStore()
const postPath = computed<PostCollectionPath | ''>(() => {
  const resourceKey = isApiResourceKey(props.path)
    ? props.path
    : findApiResourcePath(props.path)
  return isPostOperation(resourceKey) ? resourceKey : ''
})
</script>

<template>
  <v-btn data-testid="data-toolbar-collection-action-menu-button" icon>
    <v-icon>fas fa-ellipsis-vertical</v-icon>
    <v-menu
      activator="parent"
      data-testid="data-toolbar-collection-action-menu"
    >
      <v-list>
        <data-toolbar-list-item-search :path />
        <data-toolbar-list-item-create
          v-if="acl.canCreate && postPath"
          :path="postPath"
        />
      </v-list>
    </v-menu>
  </v-btn>
</template>
