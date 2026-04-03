<script
  setup
  lang="ts"
  generic="Path extends DeleteItemPath | PatchItemPath | GetItemPath"
>
import type {
  BaseAcl,
  GetItemResponseMap,
  GetItemPath,
  PatchItemPath,
  DeleteItemPath,
} from '~~/types'

const props = defineProps<{
  acl: BaseAcl
  path: Path
  item: GetItemResponseMap[Path]
}>()

defineSlots<{
  default(): any
}>()

const isEmptyMenu = computed<boolean>(() => {
  return !(props.acl.canDelete || props.acl.canUpdate)
})
</script>

<template>
  <v-btn data-testid="data-toolbar-item-action-menu-button" icon>
    <v-icon>fas fa-ellipsis-vertical</v-icon>
    <v-menu activator="parent" data-testid="data-toolbar-item-action-menu">
      <v-list>
        <slot>
          <data-toolbar-list-item-delete v-if="acl.canDelete" :path :item />
          <data-toolbar-list-item-update v-if="acl.canUpdate" :path :item />
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
