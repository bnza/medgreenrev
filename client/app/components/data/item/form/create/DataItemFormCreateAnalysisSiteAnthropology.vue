<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { generateAnalysisSubjectValidationRules } from '~/composables/useGenerateValidationCreateRules'
import type { AnalysisCode } from '~/utils'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/analyses/sites/anthropology'

const props = defineProps<{
  parent?: ResourceParent<'site'> | ResourceParent<'analysis'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const rules = inferRules(
  model,
  generateAnalysisSubjectValidationRules('analysisSiteAnthropology', model),
)

const { r$ } = useScopedRegle(model, rules)

const analysisCodes: AnalysisCode[] = ['ANTH']
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete-site
        v-model="r$.$value.subject"
        path="/api/data/sites"
        item-title="code"
        label="subject"
        granted-only
        :error-messages="r$.$errors?.subject"
        :disabled="parent?.key === 'site'"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-analysis
        v-model="r$.$value.analysis"
        :error-messages="r$.$errors?.analysis"
        :disabled="parent?.key === 'analysis'"
        :query-params="{
          'type.code': analysisCodes,
        }"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <v-textarea v-model="r$.$value.summary" label="summary" />
    </v-col>
  </v-row>
</template>
