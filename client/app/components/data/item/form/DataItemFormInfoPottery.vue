<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

defineProps<{
  item: GetItemResponseMap['/api/data/potteries/{id}']
}>()
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="item.stratigraphicUnit?.site?.name"
          label="site"
        />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.inventory" label="inventory" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <data-autocomplete
          path="/api/vocabulary/pottery/shapes"
          :model-value="item.shape ?? undefined"
          label="shape"
          item-title="value"
        />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <data-autocomplete
          path="/api/vocabulary/pottery/functional_groups"
          :model-value="item.functionalGroup"
          label="functional group"
          item-title="value"
        />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <data-autocomplete
          path="/api/vocabulary/pottery/functional_forms"
          :model-value="item.functionalForm"
          label="form"
          item-title="value"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-textarea :model-value="item.notes" label="notes" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
