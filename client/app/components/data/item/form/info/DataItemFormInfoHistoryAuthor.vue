<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/vocabulary/history/authors/{id}']
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
        <v-text-field :model-value="item.value" label="value" />
      </v-col>
      <v-col cols="6" xs="12" class="px-2">
        <v-text-field :model-value="item.variant" label="variant" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
