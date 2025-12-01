<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { useScopedRegle } from '@regle/core'
import { integer, maxValue, minValue, required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/stratigraphic_units'

const props = defineProps<{
  parent?: ResourceParent<'site'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const uniqueSite = useApiUniqueValidator(
  '/api/validator/unique/stratigraphic_units',
  ['site', 'year', 'number'],
  'Duplicate [site, year, number] combination',
)
const uniqueYear = useApiUniqueValidator(
  '/api/validator/unique/stratigraphic_units',
  ['year', 'site', 'number'],
  'Duplicate [year, site, number] combination',
)
const uniqueNumber = useApiUniqueValidator(
  '/api/validator/unique/stratigraphic_units',
  ['number', 'site', 'year'],
  'Duplicate [number, site, year] combination',
)

const { r$ } = useScopedRegle(model, {
  site: {
    required,
    uniqueSite: uniqueSite(
      () => model.value.year || 0,
      () => model.value.number,
    ),
  },
  year: {
    integer,
    uniqueYear: uniqueYear(
      () => model.value.site,
      () => model.value.number,
    ),
    minValue: minValue(2000),
    maxValue: maxValue(new Date().getFullYear()),
  },
  number: {
    required,
    integer,
    minValue: minValue(1),
    uniqueNumber: uniqueNumber(
      () => model.value.site,
      () => model.value.year || 0,
    ),
  },
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
        v-model="r$.$value.site"
        path="/api/data/sites"
        item-title="name"
        label="site"
        granted-only
        :error-messages="r$.$errors?.site"
        :disabled="parent?.key === 'site'"
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
      <v-text-field
        v-model.number="r$.$value.year"
        label="year"
        :error-messages="r$.$errors?.year"
      />
    </v-col>
    <v-col cols="4" class="px-2">
      <v-text-field
        v-model.number="r$.$value.number"
        label="number"
        :error-messages="r$.$errors?.number"
      />
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
