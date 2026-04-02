<script setup lang="ts">
import type {
  GetItemResponseMap,
  PatchItemRequestMap,
  ResourceParent,
} from '~~/types'
import { integer, maxValue, minLength, minValue, required } from '@regle/rules'

type Path = '/api/data/history/written_sources_cited_works/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
  parent?: ResourceParent<'historyWrittenSource' | 'vocHistoryHistoryCitedWork'>
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {
  citedWork: {
    required,
  },
  yearCompleted: {
    required,
    integer,
    minValue: minValue(-32768),
    maxValue: maxValue(new Date().getFullYear()),
    lessThanOrEqual: lessThan(
      'Year completed must be less than year completed upper.',
    )(() => model.value.yearCompletedUpper),
  },
  yearCompletedUpper: {
    integer,
    minValue: minValue(-32768),
    maxValue: maxValue(new Date().getFullYear()),
    greaterOrEqualThan: greaterThan(
      'Year completed upper chronology must be greater than year completed.',
    )(() => model.value.yearCompleted),
  },
})
</script>

<template>
  <v-row>
    <v-col cols="12" class="px-2">
      <data-autocomplete-written-source
        :model-value="model.writtenSource"
        label="written source"
        disabled
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <data-autocomplete
        v-model="r$.$value.citedWork"
        path="/api/vocabulary/history/cited_works"
        item-title="value"
        label="cited work"
        :error-messages="r$.$errors?.citedWork"
        :disabled="parent?.key === 'vocHistoryHistoryCitedWork'"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6" class="px-2">
      <v-text-field
        v-model.number="r$.$value.yearCompleted"
        label="year completed"
        :error-messages="r$.$errors?.yearCompleted"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <v-text-field
        v-model.number="r$.$value.yearCompletedUpper"
        label="year completed (upper)"
        :error-messages="r$.$errors?.yearCompletedUpper"
      />
    </v-col>
  </v-row>
</template>
