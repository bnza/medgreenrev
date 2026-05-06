<script setup lang="ts">
import type { PostCollectionPath, JsonLdItem } from '~~/types'
import { createRule, type Maybe, useScopedRegle } from '@regle/core'
import { required } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import { capitalize } from 'vue'

type TaxonomyLevel = 'class' | 'family' | 'genus' | 'species'

const path: PostCollectionPath = '/api/vocabulary/botany/taxonomies'

const model = generateEmptyPostModel(path)

const levelMap: Record<string, TaxonomyLevel> = {
  class: 'family',
  family: 'genus',
  genus: 'species',
}

const parentIri = ref<string | null>(null)

function onParentSelected(item: JsonLdItem | undefined) {
  if (!item) {
    model.value.level = 'class'
    return
  }
  const parentLevel = (item as Record<string, unknown>).level as string
  model.value.level = levelMap[parentLevel] ?? 'species'
}

// Set initial level
model.value.level = 'class'

watch(parentIri, (value) => {
  model.value.parent = value as typeof model.value.parent
  if (!value) {
    model.value.level = 'class'
  }
})

watch(
  () => model.value.value,
  (value) => {
    model.value.value =
      value && model.value.level !== 'species' ? capitalize(value) : value
  },
)

const apiValueValidator = new GetValidationOperation(
  '/api/validator/unique/vocabulary/botany/taxonomies/value',
)

const uniqueValue = createRule({
  validator: async (value: Maybe<string>) => {
    if (!value) return true
    const iri = parentIri.value
    const parentId = iri ? (iri.split('/').pop() ?? '') : ''
    return await apiValueValidator.isValid({ value, parent: parentId })
  },
  message: 'Value must be unique for this parent',
})

const { r$ } = useScopedRegle(model, {
  value: { required, unique: uniqueValue },
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <data-autocomplete-vocabulary-botany-taxonomy
          v-model="parentIri"
          :query-params="{ 'flat.rank[lt]': '3' }"
          label="parent"
          clearable
          @selected="onParentSelected"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="r$.$value.value"
          label="value"
          :error-messages="r$.$errors?.value"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          :model-value="model.level"
          label="level"
          readonly
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="model.englishName" label="vernacular name" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="model.spanishName" label="spanish name" />
      </v-col>
    </v-row>
  </v-container>
</template>
