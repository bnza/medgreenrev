<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { useScopedRegle } from '@regle/core'
import { maxValue, minValue, required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath = '/api/data/sediment_cores'

const props = defineProps<{
  parent?: ResourceParent<'site'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const uniqueSite = useApiUniqueValidator(
  '/api/validator/unique/sediment_cores',
  ['site', 'year', 'number'],
  'Duplicate [site, year, number] combination',
)
const uniqueYear = useApiUniqueValidator(
  '/api/validator/unique/sediment_cores',
  ['year', 'site', 'number'],
  'Duplicate [site, year, number] combination',
)
const uniqueNumber = useApiUniqueValidator(
  '/api/validator/unique/sediment_cores',
  ['number', 'site', 'year'],
  'Duplicate [site, year, number] combination',
)

const { r$ } = useScopedRegle(model, {
  site: {
    required,
    uniqueSite: uniqueSite(
      () => model.value.year,
      () => model.value.number,
    ),
  },
  year: {
    uniqueYear: uniqueYear(
      () => model.value.site,
      () => model.value.number,
    ),
    minValue: minValue(2000),
    maxValue: maxValue(new Date().getFullYear()),
  },
  number: {
    required,
    minValue: minValue(1),
    uniqueNumber: uniqueNumber(
      () => model.value.site,
      () => model.value.year,
    ),
  },
})
</script>

<template>
  <v-row>
    <v-col cols="4">
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
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="r$.$value.description" label="description" />
    </v-col>
  </v-row>
</template>
