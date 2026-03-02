<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

defineProps<{
  item: GetItemResponseMap['/api/data/archaeological_sites/{id}']
}>()
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="12" xs="6" sm="2" class="px-2">
        <v-text-field :model-value="item.code" label="code" />
      </v-col>
      <v-col cols="12" xs="6" sm="2" class="px-2">
        <v-text-field :model-value="item.name" label="name" />
      </v-col>
      <v-spacer />
      <v-col cols="12" xs="6" sm="4" class="px-2">
        <v-text-field
          :model-value="item.fieldDirector"
          label="field director"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="4" class="px-2">
        <data-autocomplete
          path="/api/vocabulary/regions"
          :model-value="item.region?.['@id']"
          label="region"
          item-title="value"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-textarea :model-value="item.description" label="description" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
