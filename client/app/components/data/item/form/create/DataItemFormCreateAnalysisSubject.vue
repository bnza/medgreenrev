<script
  setup
  lang="ts"
  generic="TParent extends AnalysisSubjectParentResourceKey"
>
import type {
  AnalysisSubjectParentResourceKey,
  ApiAnalysisSubjectResourceKey,
  ResourceParent,
} from '~~/types'
import { API_RESOURCE_MAP } from '~/utils/consts/resources'
import { inferRules } from '@regle/core'
import { generateAnalysisSubjectValidationRules } from '~/composables/useGenerateValidationCreateRules'
import { generateEmptyAnalysisSubjectModel } from '~/utils/postModel'
import { capitalize } from 'vue'

interface Props {
  parent?: ResourceParent<TParent | 'analysis'>
  subjectItemTitle: string
  subjectParentKey: TParent
  analysisQueryParams?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  analysisParentKey: 'analysis',
  analysisQueryParams: () => ({
    'type.group': [
      AnalysisGroups.MaterialAnalysis,
      AnalysisGroups.Microscope,
      AnalysisGroups.AbsoluteDating,
    ],
  }),
})

const resourceKey =
  `analysis${capitalize(props.subjectParentKey)}` as const satisfies ApiAnalysisSubjectResourceKey
const subjectPath = API_RESOURCE_MAP[props.subjectParentKey]

const model = ref(
  generateEmptyAnalysisSubjectModel(props.subjectParentKey, props.parent),
)

const rules = inferRules(
  model,
  generateAnalysisSubjectValidationRules(resourceKey, model),
)

const { r$ } = useScopedRegleItem(model, rules, { scopeKey: 'base' })

const emit = defineEmits<{
  selected: [any]
}>()
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="r$.$value.subject"
        :path="subjectPath"
        :item-title="subjectItemTitle"
        label="subject"
        granted-only
        :error-messages="r$.$errors?.subject"
        :disabled="parent?.key === subjectParentKey"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-analysis
        v-model="r$.$value.analysis"
        :error-messages="r$.$errors?.analysis"
        :disabled="parent?.key === 'analysis'"
        :query-params="analysisQueryParams"
        @selected="emit('selected', $event)"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <v-textarea v-model="r$.$value.summary" label="summary" />
    </v-col>
  </v-row>
</template>
