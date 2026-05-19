<script setup lang="ts" generic="Path extends GetCollectionPath">
import type {
  CollectionAcl,
  GetCollectionPath,
  PostCollectionPath,
} from '~~/types'
import { isSearchableGetCollectionPath } from '~/utils/consts/configs/filters'

const props = defineProps<{
  acl: CollectionAcl
  path: Path
}>()
const { findApiResourcePath, isPostOperationPath } = useOpenApiStore()
const postPath = computed<PostCollectionPath | undefined>(() => {
  if (isPostOperationPath(props.path)) {
    return props.path
  }
  const candidate = isApiResourceKey(props.path)
    ? props.path
    : findApiResourcePath(props.path)
  return isPostOperationPath(candidate) ? candidate : undefined
})
const isPostPath = computed<boolean>(() => postPath.value !== undefined)

const slots = defineSlots<{
  default(): any
  create(): any
}>()
const { isGetExportCsvCollectionPath } = useOpenApiStore()

const isEmptyMenu = computed<boolean>(() => {
  if ('default' in slots || 'create' in slots) return false
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
              v-if="acl.canCreate && postPath"
              :path="postPath"
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
