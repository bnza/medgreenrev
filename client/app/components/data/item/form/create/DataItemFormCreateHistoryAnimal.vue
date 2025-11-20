<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { useScopedRegle } from '@regle/core'
import { integer, maxValue, minValue, required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath = '/api/data/history/animals'

const props = defineProps<{
  parent?: ResourceParent<'vocHistoryLocation'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const { r$ } = useScopedRegle(model, {
  animal: {
    required,
  },
  location: {
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
        path="/api/vocabulary/history/locations"
        item-title="value"
        label="location"
        :error-messages="r$.$errors?.location"
        :disabled="parent?.key === 'vocHistoryLocation'"
      />
    </v-col>
    <v-col cols="8" xs="12" class="px-2">
      <data-autocomplete
        v-model="r$.$value.animal"
        path="/api/vocabulary/history/animals"
        item-title="value"
        label="animal"
        :error-messages="r$.$errors?.animal"
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
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="r$.$value.notes" label="notes" />
    </v-col>
  </v-row>
</template>
