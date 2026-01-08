<script setup lang="ts">
import type { PostCollectionPath } from '~~/types'
import { createRule, type Maybe, useScopedRegle } from '@regle/core'
import { required, minValue, maxValue, decimal } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import { capitalize } from 'vue'

const path: PostCollectionPath = '/api/vocabulary/history/locations'

const model = generateEmptyPostModel(path)

watch(
  () => model.value.value,
  (value) => {
    model.value.value = value ? capitalize(value) : value
  },
)

const apiValueValidator = new GetValidationOperation(
  '/api/validator/unique/vocabulary/history/locations',
)

const uniqueValue = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiValueValidator.isValid({ value: value }) : true,
  message: 'Value must be unique',
})

const { r$ } = useScopedRegle(model, {
  value: { required, unique: uniqueValue },
  n: { required, decimal, minValue: minValue(-90), maxValue: maxValue(90) },
  e: { required, decimal, minValue: minValue(-180), maxValue: maxValue(180) },
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="6" xs="12" class="px-2">
        <v-text-field
          v-model="r$.$value.value"
          label="value"
          :error-messages="r$.$errors?.value"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" xs="12" class="px-2">
        <v-text-field
          v-model.number="r$.$value.n"
          label="coordinate N"
          :error-messages="r$.$errors?.n"
          hint="Decimal Degrees WGS84 (EPSG:4326)"
          persistent-hint
        />
      </v-col>
      <v-col cols="6" xs="12" class="px-2">
        <v-text-field
          v-model.number="r$.$value.e"
          label="coordinate E"
          :error-messages="r$.$errors?.e"
          hint="Decimal Degrees WGS84 (EPSG:4326)"
          persistent-hint
        />
      </v-col>
    </v-row>
  </v-container>
</template>
