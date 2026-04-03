<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

defineProps<{
  item: GetItemResponseMap['/api/data/sampling_sites/{id}'] | undefined
}>()
</script>

<template>
  <v-container v-if="item">
    <v-container v-if="item">
      <data-item-info-box-row label="name" :text="item.name" />
      <data-item-info-box-row label="description" :text="item.description" />
    </v-container>
  </v-container>
</template>
