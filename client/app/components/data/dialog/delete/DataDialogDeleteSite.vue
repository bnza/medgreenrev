<script setup lang="ts" generic="Path extends DeleteItemPath">
import type {DeleteItemPath} from "~~/types";

const props = defineProps<{
  path: Path
}>()

</script>

<template>
  <data-dialog-delete
    :path
    title="Site"
  >
    <template #default="{item}">
      <lazy-data-item-form-info-site :item />
    </template>
  </data-dialog-delete>
</template>
