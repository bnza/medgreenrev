<script setup lang="ts">
import type {
  AbsoluteDatingRequestItem,
  GetItemPath,
  PatchItemPath,
  PatchItemRequestMap,
} from '~~/types'

const path: GetItemPath & PatchItemPath =
  '/api/data/analyses/botany/charcoals/{id}'

defineEmits<{
  refresh: []
}>()

const { initialValue, fetchedItem } = useUpdateDialog(path, undefined, [
  'absDatingAnalysisBotanyCharcoal',
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

const setAbsDatingFormStatus = (
  analysis: { type: { group: string } } | undefined,
) => {
  isAbsoluteDatingAnalysis.value = analysis?.type.group === 'absolute dating'
}
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
        subject-item-title="code"
        subject-parent-key="botanyCharcoal"
        @selected="setAbsDatingFormStatus($event)"
      />
      <data-item-form-edit-abs-dating-analysis
        v-if="isAbsoluteDatingAnalysis"
        :initial-value="fetchedItem?.absDatingAnalysis ?? null"
      />
    </template>
  </data-dialog-update>
</template>
