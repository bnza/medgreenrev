<script setup lang="ts">
import type { ApiResourcePath, PostCollectionPath } from '~~/types'
import { createRule, type Maybe, useScopedRegle } from '@regle/core'
import { decimal, maxValue, minValue, required } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import { capitalize } from 'vue'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/paleoclimate_sampling_sites'

const model = generateEmptyPostModel(path)

watch(
  () => model.value.code,
  (value) => {
    model.value.code = value?.toUpperCase()
  },
)

watch(
  () => model.value.name,
  (value) => {
    model.value.name = value ? capitalize(value) : value
  },
)

const apiCodeValidator = new GetValidationOperation(
  '/api/validator/unique/paleoclimate_sampling_sites/code',
)

const apiNameValidator = new GetValidationOperation(
  '/api/validator/unique/paleoclimate_sampling_sites/name',
)

const uniqueCode = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiCodeValidator.isValid({ code: value }) : true,
  message: 'Code must be unique',
})

const uniqueName = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiNameValidator.isValid({ name: value }) : true,
  message: 'Name must be unique',
})

const bothPresentOrAbsent = createRule({
  validator: (value: Maybe<number | string>, other: Maybe<number | string>) => {
    const hasValue = value !== null && value !== undefined && value !== ''
    const hasOther = other !== null && other !== undefined && other !== ''
    return hasValue === hasOther
  },
  message: 'Both coordinates must be present or absent',
})

const { r$ } = useScopedRegle(
  model,
  computed(() => ({
    code: {
      required,
      unique: uniqueCode,
    },
    name: {
      required,
      unique: uniqueName,
    },
    region: { required },
    n: {
      decimal,
      minValue: minValue(-90),
      maxValue: maxValue(90),
      bothPresentOrAbsent: bothPresentOrAbsent(() => model.value.e),
    },
    e: {
      decimal,
      minValue: minValue(-180),
      maxValue: maxValue(180),
      bothPresentOrAbsent: bothPresentOrAbsent(() => model.value.n),
    },
  })),
)
</script>

<template>
  <v-row>
    <v-col cols="4" xs="12" class="px-2">
      <v-text-field
        v-model.trim="r$.$value.code"
        label="code"
        :error-messages="r$.$errors?.code"
      />
    </v-col>
    <v-col cols="8" xs="12" class="px-2">
      <v-text-field
        v-model.trim="r$.$value.name"
        label="name"
        :error-messages="r$.$errors?.name"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" sm="6" class="px-2">
      <data-autocomplete
        v-model="r$.$value.region"
        path="/api/vocabulary/regions"
        label="region"
        item-title="value"
        :error-messages="r$.$errors?.region"
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
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model.trim="r$.$value.description" label="description" />
    </v-col>
  </v-row>
</template>
