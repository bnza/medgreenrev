<script
  setup
  lang="ts"
  generic="
    TParent extends Extract<
      ApiResourceKey,
      | 'botanyCharcoal'
      | 'botanySeed'
      | 'context'
      | 'individual'
      | 'pottery'
      | 'zooBone'
      | 'zooTooth'
    >
  "
>
import type { ApiResourceKey, ResourceParent } from '~~/types'
import { API_RESOURCE_MAP } from '~/utils/consts/resources'
import { useScopedRegle } from '@regle/core'

interface Item {
  subject?: string
  analysis?: string
  summary?: string | null
}

interface Props {
  initialValue: Item
  parent?: ResourceParent<TParent | 'analysis'>
  subjectItemTitle: string
  subjectParentKey: TParent
  analysisParentKey?: string
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

const emit = defineEmits<{
  selected: [any]
}>()

const path = computed(() => API_RESOURCE_MAP[props.subjectParentKey])

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {})
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="r$.$value.subject"
        :path
        :item-title="subjectItemTitle"
        label="subject"
        granted-only
        disabled
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-analysis
        v-model="r$.$value.analysis"
        disabled
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
