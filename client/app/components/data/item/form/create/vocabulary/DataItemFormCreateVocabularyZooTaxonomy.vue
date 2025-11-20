<script setup lang="ts">
import type { PostCollectionPath } from '~~/types'
import { createRule, type Maybe, useScopedRegle } from '@regle/core'
import { required } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import { capitalize } from 'vue'

const path: PostCollectionPath = '/api/vocabulary/zoo/taxonomies'

const model = generateEmptyPostModel(path)

watch(
  () => model.value.code,
  (value) => {
    model.value.code = value?.toUpperCase()
  },
)

watch(
  () => model.value.value,
  (value) => {
    model.value.value = value ? capitalize(value) : value
  },
)

watch(
  () => model.value.class,
  (value) => {
    model.value.class = value ? capitalize(value) : value
  },
)

watch(
  () => model.value.family,
  (value) => {
    model.value.family = value ? capitalize(value) : value
  },
)

const apiCodeValidator = new GetValidationOperation(
  '/api/validator/unique/vocabularies/zoo/taxonomies/code',
)

const apiValueValidator = new GetValidationOperation(
  '/api/validator/unique/vocabularies/zoo/taxonomies/value',
)

const uniqueCode = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiCodeValidator.isValid({ code: value }) : true,
  message: 'Code must be unique',
})

const uniqueValue = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiValueValidator.isValid({ value: value }) : true,
  message: 'Name must be unique',
})

const { r$ } = useScopedRegle(model, {
  code: {
    required,
    unique: uniqueCode,
  },
  value: { required, unique: uniqueValue },
  vernacularName: { required },
  class: { required },
})
</script>

<template>
  <v-container>
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
          v-model="r$.$value.value"
          label="value"
          :error-messages="r$.$errors?.value"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="r$.$value.vernacularName"
          label="vernacular name"
          :error-messages="r$.$errors?.vernacularName"
        />
      </v-col>
      <v-col cols="12" md="4">
        <data-selection-list
          v-model="r$.$value.class"
          path="/api/list/vocabulary/zoo/taxonomy_classes"
          label="class"
          :error-messages="r$.$errors?.class"
        />
      </v-col>
      <v-col cols="12" md="4">
        <data-selection-list
          v-model="r$.$value.family"
          path="/api/list/vocabulary/zoo/taxonomy_families"
          label="family"
          :error-messages="r$.$errors?.family"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
