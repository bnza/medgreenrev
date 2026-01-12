<script setup lang="ts" generic="Path extends GetCollectionPath">
import type { GetCollectionPath, CollectionAcl } from '~~/types'
import { isSearchableGetCollectionPath } from '~/utils/consts/configs/filters'

const props = defineProps<{
  acl: CollectionAcl
  path: Path
}>()
const { findApiResourcePath, isPostOperationPath } = useOpenApiStore()
const isPostPath = computed<boolean>(() => {
  if (isPostOperationPath(props.path)) {
    return true
  }
  const postPath = isApiResourceKey(props.path)
    ? props.path
    : findApiResourcePath(props.path)
  return isPostOperationPath(postPath)
})
defineSlots<{
  default(): any
  create(): any
}>()
const { isGetExportCsvCollectionPath } = useOpenApiStore()

const isEmptyMenu = computed<boolean>(() => {
  return !(
    isSearchableGetCollectionPath(props.path) ||
    (props.acl.canExport && isGetExportCsvCollectionPath(props.path)) ||
    (props.acl.canCreate && isPostPath.value)
  )
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
        <slot>
          <data-toolbar-list-item-search
            v-if="isSearchableGetCollectionPath(path)"
            :path
          />
          <data-toolbar-list-item-download
            v-if="acl.canExport && isGetExportCsvCollectionPath(path)"
            :path
          />
          <slot name="create">
            <data-toolbar-list-item-create
              v-if="acl.canCreate && isPostPath"
              :path
            />
          </slot>
          <v-list-item
            v-if="isEmptyMenu"
            data-testid="data-toolbar-menu-empty"
            title="No actions"
            color="grey"
          />
        </slot>
      </v-list>
    </v-menu>
  </v-btn>
</template>
