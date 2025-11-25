<script setup lang="ts">
import type { AnalysisCode } from '~/utils'
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { inferRules, useScopedRegle } from '@regle/core'
import { generateAnalysisSubjectValidationRules } from '~/composables/useGenerateValidationCreateRules'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/analyses/contexts/botany'

const props = defineProps<{
  parent?: ResourceParent<'context'> | ResourceParent<'analysis'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const rules = inferRules(
  model,
  generateAnalysisSubjectValidationRules('analysisContextBotany', model),
)

const { r$ } = useScopedRegle(model, rules)

const analysisCodes: AnalysisCode[] = ['ANTHRA', 'CARP']
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="r$.$value.subject"
        path="/api/data/contexts"
        item-title="name"
        label="subject"
        granted-only
        :error-messages="r$.$errors?.subject"
        :disabled="parent?.key === 'context'"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-analysis
        v-model="r$.$value.analysis"
        :error-messages="r$.$errors?.analysis"
        :disabled="parent?.key === 'analysis'"
        :query-params="{ 'type.code': analysisCodes }"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <data-selection-vocabulary
        v-model="r$.$value.taxonomies"
        multiple
        path="/api/vocabulary/botany/taxonomies"
        label="taxonomies"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <v-textarea v-model="r$.$value.summary" label="summary" />
    </v-col>
  </v-row>
</template>
