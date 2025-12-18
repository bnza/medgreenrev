<script setup lang="ts">
import type { ApiResourcePath, PostCollectionPath } from '~~/types'
import { integer, maxValue, minValue, required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath = '/api/data/analyses'

const uniqueType = useApiUniqueValidator(
  '/api/validator/unique/analyses',
  ['type', 'year', 'identifier'],
  'Duplicate [type, year, identifier] combination',
)
const uniqueYear = useApiUniqueValidator(
  '/api/validator/unique/analyses',
  ['year', 'type', 'identifier'],
  'Duplicate [type, year, identifier] combination',
)
const uniqueIdentifier = useApiUniqueValidator(
  '/api/validator/unique/analyses',
  ['identifier', 'type', 'year'],
  'Duplicate [type, year, identifier] combination',
)

const model = generateEmptyPostModel(path)
const { r$ } = useScopedRegle(
  model,
  computed(() => ({
    type: {
      required,
      uniqueType: uniqueType(
        () => model.value.year,
        () => model.value.identifier,
      ),
    },
    year: {
      required,
      integer,
      uniqueYear: uniqueYear(
        () => model.value.type,
        () => model.value.identifier,
      ),
      minValue: minValue(2000),
      maxValue: maxValue(new Date().getFullYear()),
    },
    identifier: {
      required,
      uniqueIdentifier: uniqueIdentifier(
        () => model.value.type,
        () => model.value.year,
      ),
    },
  })),
)
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
        />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-text-field
          v-model.number="r$.$value.year"
          label="year"
          :error-messages="r$.$errors.year"
        />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-text-field
          v-model="r$.$value.identifier"
          label="identifier"
          :error-messages="r$.$errors.identifier"
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
