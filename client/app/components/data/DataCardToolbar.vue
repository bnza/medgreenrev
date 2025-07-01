<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <v-toolbar
    data-testid="data-card-toolbar"
    density="compact"
  >
    <template #prepend>
      <slot name="toolbar-prepend"/>
    </template>
    <template #title
    >{{ title }}
      <slot name="title-append"/>
    </template>
    <template #append>
      <slot name="toolbar-append"/>
    </template>
  </v-toolbar>
</template>
