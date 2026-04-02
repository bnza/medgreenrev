<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { required, integer, minValue, maxValue } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/history/written_sources_cited_works'

const props = defineProps<{
  parent?: ResourceParent<'historyWrittenSource' | 'vocHistoryHistoryCitedWork'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const { r$ } = useScopedRegle(model, {
  writtenSource: {
    required,
  },
  citedWork: {
    required,
  },
  yearCompleted: {
    required,
    integer,
    minValue: minValue(-32768),
    maxValue: maxValue(new Date().getFullYear()),
    lessThanOrEqual: lessThanOrEqual(
      'Year completed must be greater than or equal year completed upper.',
    )(() => model.value.yearCompletedUpper),
  },
  yearCompletedUpper: {
    integer,
    minValue: minValue(-32768),
    maxValue: maxValue(new Date().getFullYear()),
    greaterOrEqualThan: greaterThanOrEqual(
      'Year completed upper chronology must be less than or equal year completed.',
    )(() => model.value.yearCompleted),
  },
})
</script>

<template>
  <v-row>
    <v-col cols="12" class="px-2">
      <data-autocomplete-written-source
        v-model="r$.$value.writtenSource"
        label="written source"
        :error-messages="r$.$errors?.writtenSource"
        :disabled="parent?.key === 'historyWrittenSource'"
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
