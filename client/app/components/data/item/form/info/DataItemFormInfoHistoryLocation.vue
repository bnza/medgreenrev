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
    <v-row>
      <v-col cols="12" xs="12" sm="6" class="px-2">
        <data-autocomplete
          path="/api/vocabulary/regions"
          :model-value="item.region?.['@id']"
          label="region"
          item-title="value"
        />
      </v-col>
    </v-row>
    <data-item-form-coordinate :x="item.e" :y="item.n" />
  </data-item-form-read>
</template>
