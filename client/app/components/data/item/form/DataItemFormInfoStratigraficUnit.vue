<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

defineProps<{
  item: GetItemResponseMap['/api/stratigraphic_units/{id}']
}>()
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.site?.name" label="site" />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.year" label="year" />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.number" label="number" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-textarea :model-value="item.interpretation" label="interpretation" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
