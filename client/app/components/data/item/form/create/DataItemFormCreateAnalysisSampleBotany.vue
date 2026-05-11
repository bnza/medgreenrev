<script setup lang="ts">
import type { AnalysisCode } from '~/utils'
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { generateAnalysisSubjectValidationRules } from '~/composables/useGenerateValidationCreateRules'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/analyses/samples/botany'

const props = defineProps<{
  parent?: ResourceParent<'sample'> | ResourceParent<'analysis'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const rules = inferRules(
  model,
  generateAnalysisSubjectValidationRules('analysisSampleBotany', model),
)

const { r$ } = useScopedRegle(model, rules)

const analysisCodes: AnalysisCode[] = ['SDNA', 'POL', 'PHY']
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete-sample
        v-model="r$.$value.subject"
        path="/api/data/samples"
        item-title="code"
        label="subject"
        granted-only
        :error-messages="r$.$errors?.subject"
        :disabled="parent?.key === 'sample'"
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
      <v-textarea v-model="r$.$value.summary" label="summary" />
    </v-col>
  </v-row>
</template>
