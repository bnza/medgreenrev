<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { generateAnalysisTaxonomySubjectValidationRules } from '~/composables/useGenerateValidationCreateRules'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/analyses/context_botany_taxonomies'

const props = defineProps<{
  parent?: ResourceParent<'analysisContextBotany'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const rules = inferRules(
  model,
  generateAnalysisTaxonomySubjectValidationRules(
    'analysisContextBotanyTaxonomy',
    model,
  ),
)

const { r$ } = useScopedRegle(model, rules)
</script>

<template>
  <v-row>
    <v-col cols="6" class="px-2">
      <v-text-field
        :model-value="parent?.item.subject?.code"
        disabled
        label="context"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <v-text-field
        :model-value="parent?.item.analysis?.code"
        disabled
        label="analysis"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="2" class="px-2">
      <v-checkbox v-model="r$.$value.type" label="type" />
    </v-col>
    <v-col cols="2" class="px-2">
      <v-checkbox v-model="r$.$value.cf" label="cf" />
    </v-col>
    <v-col cols="6">
      <data-autocomplete-vocabulary-botany-taxonomy
        v-model="r$.$value.taxonomy"
        :error-messages="r$.$errors?.taxonomy"
      />
    </v-col>
    <v-col cols="2" class="px-2">
      <v-checkbox v-model="r$.$value.sp" label="sp" />
    </v-col>
  </v-row>
</template>
