<script setup lang="ts">
import type { ApiResourcePath, PostCollectionPath } from '~~/types'
import { createRule, type Maybe, useScopedRegle } from '@regle/core'
import { integer, maxValue, minValue, required } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import { capitalize } from 'vue'

const path: ApiResourcePath | PostCollectionPath = '/api/data/sites'

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
  '/api/validator/unique/sites/code',
)

const apiNameValidator = new GetValidationOperation(
  '/api/validator/unique/sites/name',
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
    <v-col cols="4" xs="12" class="px-2">
      <data-selection-list
        v-model="r$.$value.fieldDirector"
        path="/api/list/persons"
        label="field director"
        :error-messages="r$.$errors?.fieldDirector"
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
      <data-selection-vocabulary
        v-model="r$.$value.culturalContexts"
        path="/api/vocabulary/cultural_contexts"
        label="cultural contexts"
        multiple
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model.trim="r$.$value.description" label="description" />
    </v-col>
  </v-row>
</template>
