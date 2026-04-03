<script setup lang="ts">
import type { PostCollectionPath } from '~~/types'
import { createRule, type Maybe, useScopedRegle } from '@regle/core'
import { required } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'

const path: PostCollectionPath = '/api/vocabulary/history/plants'

const model = generateEmptyPostModel(path)

watch(
  () => model.value.value,
  (value) => {
    model.value.value = value ? value.toLowerCase() : value
  },
)

const apiValueValidator = new GetValidationOperation(
  '/api/validator/unique/vocabulary/history/plants',
)

const uniqueValue = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiValueValidator.isValid({ value: value }) : true,
  message: 'Value must be unique',
})

const { r$ } = useScopedRegle(model, {
  value: { required, unique: uniqueValue },
  taxonomy: {},
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
      <v-col cols="6" xs="12" class="px-2">
        <data-autocomplete
          v-model="r$.$value.taxonomy"
          path="/api/vocabulary/botany/taxonomies"
          item-title="value"
          label="species"
          clearable
        />
      </v-col>
    </v-row>
  </v-container>
</template>
