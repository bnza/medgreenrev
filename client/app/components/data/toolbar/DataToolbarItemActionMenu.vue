<script
  setup
  lang="ts"
  generic="Path extends DeleteItemPath | PatchItemPath | GetItemPath"
>
import type {
  BaseAcl,
  DeleteItemPath,
  GetItemPath,
  GetItemResponseMap,
  Iri,
  PatchItemPath,
  PostCollectionPath,
} from '~~/types'

const props = defineProps<{
  acl: BaseAcl
  path: Path
  item: GetItemResponseMap[Path]
}>()

defineSlots<{
  default(): any
}>()

const { findApiResourcePath, isPostOperationPath } = useOpenApiStore()

// Resolve the POST collection path for this resource, used to key the
// create/duplicate dialog store. Falls back to `undefined` when the resource
// has no POST collection endpoint (read-only resources): in that case the
// duplicate entry is not rendered.
const postPath = computed<PostCollectionPath | undefined>(() => {
  const candidate = isApiResourceKey(props.path)
    ? props.path
    : findApiResourcePath(props.path)
  return isPostOperationPath(candidate) ? candidate : undefined
})

const itemForDuplicate = computed<{ '@id': Iri } | undefined>(() => {
  return isApiResourceObject(props.item) ? props.item : undefined
})

const isEmptyMenu = computed<boolean>(
  () => !(props.acl.canDelete || props.acl.canUpdate || true),
)
</script>

<template>
  <v-btn data-testid="data-toolbar-item-action-menu-button" icon>
    <v-icon>fas fa-ellipsis-vertical</v-icon>
    <v-menu activator="parent" data-testid="data-toolbar-item-action-menu">
      <v-list>
        <slot>
          <data-toolbar-list-item-delete v-if="acl.canDelete" :path :item />
          <data-toolbar-list-item-update v-if="acl.canUpdate" :path :item />
          <data-toolbar-list-item-duplicate
            v-if="true && postPath && itemForDuplicate"
            :path="postPath"
            :item
          />
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
