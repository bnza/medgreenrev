<script setup lang="ts">
import type {
  AbsoluteDatingRequestItem,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { useCollectScopeRecord } from '~/composables'

defineProps<{
  parent?: ResourceParent<'zooBone' | 'analysis'>
}>()

const path = '/api/data/analyses/zoo/bones'

const emit = defineEmits<{
  refresh: []
}>()

const { r$ } = useCollectScopeRecord<{
  base: PostCollectionRequestMap[typeof path]
  absDating: AbsoluteDatingRequestItem
}>()

const { item } = useCreateAbsDatingAnalysisItem(r$)

const isAbsoluteDatingAnalysis = ref(false)
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
        subject-parent-key="zooBone"
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
