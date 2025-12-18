<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

defineProps<{
  item: GetItemResponseMap['/api/vocabulary/history/locations/{id}'] | undefined
}>()
</script>

<template>
  <v-container v-if="item">
    <data-item-info-box-row label="value" :text="item.value" />
  </v-container>
</template>
