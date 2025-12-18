<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { integer, maxValue, minValue } from '@regle/rules'

type Path = '/api/data/stratigraphic_units/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {
  chronologyLower: {
    integer,
    minValue: minValue(-32768),
    maxValue: maxValue(new Date().getFullYear()),
    lessThanOrEqual: lessThanOrEqual(
      'Lower chronology must be greater than or equal upper chronology.',
    )(() => model.value.chronologyUpper),
  },
  chronologyUpper: {
    integer,
    minValue: minValue(-32768),
    maxValue: maxValue(new Date().getFullYear()),
    greaterOrEqualThan: greaterThanOrEqual(
      'Upper chronology must be less than or equal lower chronology.',
    )(() => model.value.chronologyLower),
  },
})

const areaQueryParams = computed(() =>
  r$.$value.site ? { site: r$.$value.site } : {},
)
const buildingQueryParams = computed(() => ({
  ...areaQueryParams.value,
  ...(r$.$value.area ? { area: r$.$value.area } : {}),
}))
</script>

<template>
  <v-row>
    <v-col cols="4" class="px-2">
      <data-autocomplete-site
        :model-value="r$.$value.site"
        path="/api/data/sites"
        item-title="name"
        label="site"
        granted-only
        disabled
      />
    </v-col>
    <v-col cols="4" class="px-2">
      <data-selection-list
        v-model="r$.$value.area"
        path="/api/list/areas"
        label="area"
        :query-params="areaQueryParams"
      />
    </v-col>
    <v-col cols="4" class="px-2">
      <data-selection-list
        v-model="r$.$value.building"
        path="/api/list/buildings"
        label="building"
        :query-params="buildingQueryParams"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4" class="px-2">
      <v-text-field :model-value="r$.$value.year" label="year" disabled />
    </v-col>
    <v-col cols="4" class="px-2">
      <v-text-field :model-value="r$.$value.number" label="number" disabled />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="5" class="px-2">
      <v-text-field
        v-model.number="r$.$value.chronologyLower"
        label="chronology (lower)"
        :error-messages="r$.$errors?.chronologyLower"
      />
    </v-col>
    <v-col cols="12" xs="5" class="px-2">
      <v-text-field
        v-model.number="r$.$value.chronologyUpper"
        label="chronology (upper)"
        :error-messages="r$.$errors?.chronologyUpper"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="r$.$value.interpretation" label="interpretation" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="r$.$value.description" label="description" />
    </v-col>
  </v-row>
</template>
