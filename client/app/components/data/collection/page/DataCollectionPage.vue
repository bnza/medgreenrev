<script setup lang="ts" generic="Path extends GetCollectionPath">
import type {GetCollectionPath} from "~~/types";

defineProps<{
  path: Path
  title: string
}>()

defineSlots<{
  default(): any
  dialogs(): any
}>()

const {siteCollectionAcl} = useAppAuth()

</script>

<template>
  <data-card title="Sites">
    <template #toolbar-append>
      <data-toolbar-collection-action-menu
        :acl="siteCollectionAcl"
        :path
      />
    </template>
    <template #default>
      <slot />
    </template>
    <template #append>
      <slot name="dialogs"/>
      <data-dialog-search-site :path/>
    </template>
  </data-card>
</template>
