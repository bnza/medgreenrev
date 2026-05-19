<script setup lang="ts">
import type {
  AbsoluteDatingRequestItem,
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { useCollectScopeRecord } from '~/composables'

defineProps<{
  parent?: ResourceParent<'sample' | 'analysis'>
}>()

const path: PostCollectionPath = '/api/data/analyses/samples' as const

const emit = defineEmits<{
  refresh: []
}>()

const { r$ } = useCollectScopeRecord<{
  base: PostCollectionRequestMap[typeof path]
  absDating: AbsoluteDatingRequestItem
}>()

const { item } = useCreateAbsDatingAnalysisItem(r$)

const isAbsoluteDatingAnalysis = ref(false)
const analysisQueryParams = {
  'type.group': [
    AnalysisGroups.MaterialAnalysis,
    AnalysisGroups.AbsoluteDating,
  ],
} as const
</script>

<template>
  <data-dialog-create
    :item
    :parent
    :path
    :regle="r$"

    @refresh="emit('refresh')"
  >
    <template #default>
      <data-item-form-create-analysis-subject
        :parent
        subject-item-title="code"
        subject-parent-key="sample"
        :analysis-query-params
        @selected="
          isAbsoluteDatingAnalysis = $event?.type?.group === 'absolute dating'
        "
      />
      <data-item-form-edit-abs-dating-analysis
        v-if="isAbsoluteDatingAnalysis"
        :initial-value="null"
      />
    </template>
  </data-dialog-create>
</template>
