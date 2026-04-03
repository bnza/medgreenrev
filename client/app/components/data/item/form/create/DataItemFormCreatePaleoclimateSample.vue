<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { integer, maxValue, minValue, required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/paleoclimate_samples'

const props = defineProps<{
  parent?: ResourceParent<'paleoclimateSamplingSite'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const uniqueSite = useApiUniqueValidator(
  '/api/validator/unique/paleoclimate_samples',
  ['site', 'number'],
  'Duplicate [site, number] combination',
)
const uniqueNumber = useApiUniqueValidator(
  '/api/validator/unique/paleoclimate_samples',
  ['number', 'site'],
  'Duplicate [site, number] combination',
)

const { r$ } = useScopedRegle(model, {
  site: {
    required,
    uniqueSite: uniqueSite(() => model.value.number),
  },
  number: {
    required,
    integer,
    minValue: minValue(1),
    uniqueNumber: uniqueNumber(() => model.value.site),
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
</script>

<template>
  <v-row>
    <v-col cols="4" class="px-2">
      <data-autocomplete-site
        v-model="r$.$value.site"
        path="/api/data/paleoclimate_sampling_sites"
        item-title="name"
        label="site"
        :error-messages="r$.$errors?.site"
        :disabled="parent?.key === 'paleoclimateSamplingSite'"
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
      <v-textarea v-model="r$.$value.description" label="description" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6" class="px-2">
      <v-checkbox
        v-model="r$.$value.precipitationRecord"
        label="precipitations"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <v-checkbox v-model="r$.$value.temperatureRecord" label="temperature" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6" md="3" class="px-2">
      <v-checkbox
        v-model="r$.$value.fluidInclusions"
        label="fluid inclusions"
      />
    </v-col>
    <v-col cols="6" md="3" class="px-2">
      <v-checkbox
        v-model="r$.$value.petrographicDescriptions"
        label="petrographic descriptions"
      />
    </v-col>
    <v-col cols="6" md="3" class="px-2">
      <v-checkbox v-model="r$.$value.stableIsotopes" label="stable isotopes" />
    </v-col>
    <v-col cols="6" md="3" class="px-2">
      <v-checkbox v-model="r$.$value.traceElements" label="trace elements" />
    </v-col>
  </v-row>
</template>
