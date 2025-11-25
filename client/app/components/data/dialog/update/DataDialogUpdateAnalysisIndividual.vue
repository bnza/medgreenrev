<script setup lang="ts">
import type {
  AbsoluteDatingRequestItem,
  GetItemPath,
  PatchItemPath,
  PatchItemRequestMap,
} from '~~/types'

const path: GetItemPath & PatchItemPath = '/api/data/analyses/individuals/{id}'

defineEmits<{
  refresh: []
}>()

const { initialValue, fetchedItem } = useUpdateDialog(path, undefined, [
  'absDatingAnalysisIndividual',
])

const { r$ } = useCollectScopeRecord<{
  base: PatchItemRequestMap[typeof path]
  absDating: AbsoluteDatingRequestItem
}>()

const item = computed(() => {
  const base = r$.$value.base ?? {}
  base.absDatingAnalysis = isEmptyObject(r$.$value.absDating)
    ? null
    : r$.$value.absDating
  return base
})

const isAbsoluteDatingAnalysis = ref(false)
</script>

<template>
  <data-dialog-update
    :initial-value
    :item
    :path
    :regle="r$"
    @refresh="$emit('refresh')"
  >
    <template #default>
      <data-item-form-update-analysis-subject
        v-if="initialValue"
        :initial-value
        subject-item-title="identifier"
        subject-parent-key="individual"
        @selected="
          isAbsoluteDatingAnalysis = $event?.type?.group === 'absolute dating'
        "
      />
      <data-item-form-edit-abs-dating-analysis
        v-if="isAbsoluteDatingAnalysis"
        :initial-value="fetchedItem?.absDatingAnalysis ?? null"
      />
    </template>
  </data-dialog-update>
</template>
