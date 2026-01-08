<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/vocabulary/history/locations/{id}']
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="6" xs="12" class="px-2">
        <v-text-field :model-value="item.value" label="name" />
      </v-col>
    </v-row>
    <data-item-form-coordinate :x="item.e" :y="item.n" />
  </data-item-form-read>
</template>
