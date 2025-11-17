<script setup lang="ts">
import type {
  AbsoluteDatingRequestItem,
  GetItemPath,
  PatchItemPath,
  PatchItemRequestMap,
} from '~~/types'
import { useCollectScope } from '@regle/core'
import { isEmptyObject } from '~/utils'

const path: GetItemPath & PatchItemPath = '/api/data/analyses/botany/seeds/{id}'

defineEmits<{
  refresh: []
}>()

const { initialValue, fetchedItem } = useUpdateDialog(path)

const { r$ } =
  useCollectScope<
    [PatchItemRequestMap[typeof path], AbsoluteDatingRequestItem]
  >()

const item = computed(() => {
  const base = r$.$value[0] ?? {}
  base.absDatingAnalysis = isEmptyObject(r$.$value[1]) ? null : r$.$value[1]
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
        subject-item-title="code"
        subject-parent-key="botanySeed"
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
