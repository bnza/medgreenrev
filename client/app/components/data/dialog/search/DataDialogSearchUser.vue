<script setup lang="ts" generic="Path extends ApiPath">
import type { ApiPath } from '~~/types'

defineProps<{
  path: Path
}>()
</script>

<template>
  <data-dialog-search :path title="User">
    <template #default>
      <p>Search User</p>
    </template>
  </data-dialog-search>
</template>
