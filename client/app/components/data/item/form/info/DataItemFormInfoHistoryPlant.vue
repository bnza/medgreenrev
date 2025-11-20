<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/history/plants/{id}']
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
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.location?.value" label="location" />
      </v-col>
      <v-col cols="8" xs="12" class="px-2">
        <v-text-field :model-value="item.plant?.value" label="plant" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" xs="12" class="px-2">
        <v-text-field
          :model-value="item.chronologyLower"
          label="chronology (lower)"
        />
      </v-col>
      <v-col cols="6" xs="12" class="px-2">
        <v-text-field
          :model-value="item.chronologyUpper"
          label="chronology (upper)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-text-field :model-value="item.reference" label="reference" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-textarea :model-value="item.notes" label="notes" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
