<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { generateAnalysisSubjectValidationRules } from '~/composables/useGenerateValidationCreateRules'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/analyses/samples/microstratigraphy'

const props = defineProps<{
  parent?:
    | ResourceParent<'sample'>
    | ResourceParent<'analysis'>
    | ResourceParent<'stratigraphicUnit'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const rules = inferRules(
  model,
  generateAnalysisSubjectValidationRules(
    'analysisSampleMicrostratigraphy',
    model,
  ),
)

const { r$ } = useScopedRegle(model, rules)

const sampleQueryParams = computed(() =>
  props.parent?.key === 'stratigraphicUnit'
    ? {
        'sampleStratigraphicUnits.stratigraphicUnit': props.parent.item['@id'],
      }
    : {},
)
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="r$.$value.subject"
        path="/api/data/samples"
        item-title="code"
        label="subject"
        granted-only
        :error-messages="r$.$errors?.subject"
        :disabled="parent?.key === 'sample'"
        :query-params="sampleQueryParams"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-analysis
        v-model="r$.$value.analysis"
        :error-messages="r$.$errors?.analysis"
        :disabled="parent?.key === 'analysis'"
        :query-params="{
          'type.group': [AnalysisGroups.Micromorphology],
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
