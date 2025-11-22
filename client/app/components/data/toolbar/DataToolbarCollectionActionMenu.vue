<script setup lang="ts" generic="Path extends GetCollectionPath">
import type {
  GetCollectionPath,
  CollectionAcl,
  PostCollectionPath,
} from '~~/types'

const props = defineProps<{
  acl: CollectionAcl
  path: Path
}>()
const { findApiResourcePath, isPostOperationPath } = useOpenApiStore()
const postPath = computed<PostCollectionPath | ''>(() => {
  if (isPostOperationPath(props.path)) {
    return props.path
  }
  const _postPath = isApiResourceKey(props.path)
    ? props.path
    : findApiResourcePath(props.path)
  return isPostOperationPath(_postPath) ? _postPath : ''
})
defineSlots<{
  default(): any
}>()
</script>

<template>
  <v-btn data-testid="data-toolbar-collection-action-menu-button" icon>
    <v-icon>fas fa-ellipsis-vertical</v-icon>
    <v-menu
      activator="parent"
      data-testid="data-toolbar-collection-action-menu"
    >
      <v-list>
        <slot>
          <data-toolbar-list-item-search :path />
          <data-toolbar-list-item-download v-if="acl.canExport" :path />
          <data-toolbar-list-item-create
            v-if="acl.canCreate && postPath"
            :path
          />
        </slot>
      </v-list>
    </v-menu>
  </v-btn>
</template>
