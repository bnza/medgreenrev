<script
  setup
  lang="ts"
  generic="
    TParent extends Extract<
      ApiResourceKey,
      | 'botanyCharcoal'
      | 'botanySeed'
      | 'individual'
      | 'pottery'
      | 'zooBone'
      | 'zooTooth'
    >
  "
>
import type { RegleErrorTree } from '@regle/core'
import type { ApiResourceKey, ResourceParent } from '~~/types'
import { API_RESOURCE_MAP } from '~/utils/consts/resources'

interface Item {
  subject?: string
  analysis?: string
  summary?: string | null
}

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
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

const isAnalysisDisabled = computed(() => {
  if (props.mode === 'update') return true
  return props.parent?.key === props.analysisParentKey
})

const path = computed(() => API_RESOURCE_MAP[props.subjectParentKey])
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="item.subject"
        :path
        :item-title="subjectItemTitle"
        label="subject"
        granted-only
        :error-messages="errors?.subject"
        :disabled="parent?.key === subjectParentKey || mode === 'update'"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-analysis
        v-model="item.analysis"
        :error-messages="errors?.analysis"
        :disabled="isAnalysisDisabled"
        :query-params="analysisQueryParams"
        @selected="emit('selected', $event)"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <v-textarea
        v-model="item.summary"
        label="summary"
        :error-messages="errors?.summary"
      />
    </v-col>
  </v-row>
</template>
