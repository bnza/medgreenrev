<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'

type Path = '/api/data/analyses/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {})
</script>

<template>
  <v-card-text class="px-0">
    <v-row>
      <v-col cols="4" class="px-2">
        <data-autocomplete-hierarchical-vocabulary
          v-model="r$.$value.type"
          path="/api/vocabulary/analysis/types"
          label="type"
          :error-messages="r$.$errors.type"
          disabled
        />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-text-field
          v-model.number="r$.$value.year"
          label="year"
          :error-messages="r$.$errors.year"
          disabled
        />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-text-field
          v-model="r$.$value.identifier"
          label="identifier"
          :error-messages="r$.$errors.identifier"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="px-2">
        <data-selection-analysis-status v-model="r$.$value.status" />
      </v-col>
      <v-col cols="4">
        <data-selection-list
          v-model="r$.$value.responsible"
          path="/api/list/persons"
          label="responsible"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" class="px-2">
        <data-selection-list
          v-model="r$.$value.laboratory"
          path="/api/list/analyses/laboratories"
          label="laboratory"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="px-2">
        <v-textarea v-model="r$.$value.summary" label="summary" rows="3" />
      </v-col>
    </v-row>
  </v-card-text>
</template>
