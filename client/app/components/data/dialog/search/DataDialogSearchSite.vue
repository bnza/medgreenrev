<script setup lang="ts" generic="Path extends ApiPath">

import type {ApiPath} from "~~/types";

defineProps<{
  path: Path
}>()

</script>

<template>
  <data-dialog-search :path title="Site">
    <template #default>
      <p>Search Site</p>
    </template>
  </data-dialog-search>
</template>
