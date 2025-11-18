<script setup lang="ts">
import { useScopedRegle } from '@regle/core'
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { integer, maxValue, minValue, required } from '@regle/rules'

type Path = '/api/data/history/plants/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {
  plant: {
    required,
  },
  location: {
    required,
  },
  reference: {
    required,
  },
  chronologyLower: {
    required,
    integer,
    minValue: minValue(-32768),
    maxValue: maxValue(new Date().getFullYear()),
    lessThanOrEqual: lessThanOrEqual(
      'Lower chronology must be greater than or equal upper chronology.',
    )(() => model.value.chronologyUpper),
  },
  chronologyUpper: {
    required,
    integer,
    minValue: minValue(-32768),
    maxValue: maxValue(new Date().getFullYear()),
    greaterOrEqualThan: greaterThanOrEqual(
      'Upper chronology must be less than or equal lower chronology.',
    )(() => model.value.chronologyLower),
  },
})
</script>

<template>
  <v-row>
    <v-col cols="4" xs="12" class="px-2">
      <data-autocomplete
        v-model="r$.$value.location"
        path="/api/data/history/locations"
        item-title="name"
        label="location"
        :error-messages="r$.$errors?.location"
        disabled
      />
    </v-col>
    <v-col cols="8" xs="12" class="px-2">
      <data-autocomplete
        v-model="r$.$value.plant"
        path="/api/vocabulary/history/plants"
        item-title="value"
        label="plant"
        :error-messages="r$.$errors?.plant"
        disabled
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6" xs="12" class="px-2">
      <v-text-field
        v-model.number="r$.$value.chronologyLower"
        label="chronology (lower)"
        :error-messages="r$.$errors?.chronologyLower"
      />
    </v-col>
    <v-col cols="6" xs="12" class="px-2">
      <v-text-field
        v-model.number="r$.$value.chronologyUpper"
        label="chronology (upper)"
        :error-messages="r$.$errors?.chronologyUpper"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <data-selection-list
        v-model="r$.$value.reference"
        path="/api/list/history/references"
        label="reference"
        :error-messages="r$.$errors?.reference"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="r$.$value.notes" label="notes" />
    </v-col>
  </v-row>
</template>
