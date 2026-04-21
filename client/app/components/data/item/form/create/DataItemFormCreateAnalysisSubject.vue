<script
  setup
  lang="ts"
  generic="TParent extends AnalysisSubjectParentResourceKey"
>
import type {
  AnalysisSubjectParentResourceKey,
  AnalysisSubjectResourceKey,
  ResourceParent,
} from '~~/types'
import { API_RESOURCE_MAP } from '~/utils/consts/resources'
import { generateAnalysisSubjectValidationRules } from '~/composables/useGenerateValidationCreateRules'
import { generateEmptyAnalysisSubjectModel } from '~/utils/postModel'
import { capitalize } from 'vue'
import { ApiSpecialistRole } from '~/utils/consts/auth'

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
  `analysis${capitalize(props.subjectParentKey)}` as const satisfies AnalysisSubjectResourceKey
const subjectPath = API_RESOURCE_MAP[props.subjectParentKey]

const model = ref(
  generateEmptyAnalysisSubjectModel(props.subjectParentKey, props.parent),
)

const rules = inferRules(
  model,
  generateAnalysisSubjectValidationRules(resourceKey, model),
)

const { hasSpecialistRole, hasAnySpecialistRole } = useAppAuth()

const roleMap: Record<
  AnalysisSubjectParentResourceKey,
  ApiSpecialistRole | null
> = {
  botanyCharcoal: ApiSpecialistRole.Archaeobotanist,
  botanySeed: ApiSpecialistRole.Archaeobotanist,
  individual: ApiSpecialistRole.Anthropologist,
  pottery: ApiSpecialistRole.CeramicSpecialist,
  sample: null,
  sedimentCoreDepth: ApiSpecialistRole.GeoArchaeologist,
  zooBone: ApiSpecialistRole.ZooArchaeologist,
  zooTooth: ApiSpecialistRole.ZooArchaeologist,
}

// Sampling does not require a granting
const grantedResourceKeys = computed(
  () =>
    Object.keys(roleMap).filter(
      (value) => !['sedimentCoreDepth'].includes(value),
    ) as TParent[],
)
const role = computed<ApiSpecialistRole | null>(
  () => roleMap[props.subjectParentKey],
)

// If the current logged user has any of the specialist roles related to AnalysisSubjectParentResourceKey
const grantedOnlySubjects = computed<boolean>(() =>
  role.value ? hasSpecialistRole(role.value).value : hasAnySpecialistRole.value,
)

const grantedOnly = computed(
  () =>
    grantedOnlySubjects.value &&
    grantedResourceKeys.value.includes(props.subjectParentKey),
)

const { r$ } = useScopedRegleItem(model, rules, { scopeKey: 'base' })

const emit = defineEmits<{
  selected: [any]
}>()

onUnmounted(() => emit('selected', false))
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="r$.$value.subject"
        :path="subjectPath"
        :item-title="subjectItemTitle"
        label="subject"
        :granted-only
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
        :granted-only="!grantedOnlySubjects"
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
