<script setup lang="ts">
import type { PostCollectionPath } from '~~/types'
import { createRule, type Maybe, useScopedRegle } from '@regle/core'
import { required } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'

const path: PostCollectionPath = '/api/vocabulary/botany/taxonomies'

const model = generateEmptyPostModel(path)

const apiValueValidator = new GetValidationOperation(
  '/api/validator/unique/vocabularies/botany/taxonomies/value',
)

const uniqueValue = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiValueValidator.isValid({ value: value }) : true,
  message: 'Name must be unique',
})

const { r$ } = useScopedRegle(model, {
  value: { required, unique: uniqueValue },
  vernacularName: { required },
  class: { required },
})
</script>

<template>
  <v-container>
    <v-row>
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
          path="/api/list/vocabulary/botany/taxonomy_classes"
          label="class"
          :error-messages="r$.$errors?.class"
        />
      </v-col>
      <v-col cols="12" md="4">
        <data-selection-list
          v-model="r$.$value.family"
          path="/api/list/vocabulary/botany/taxonomy_families"
          label="family"
          :error-messages="r$.$errors?.family"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
