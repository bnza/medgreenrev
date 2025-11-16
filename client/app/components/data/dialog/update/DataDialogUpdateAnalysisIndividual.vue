<script setup lang="ts">
import type { GetItemPath, PatchItemPath, PatchItemRequestMap } from '~~/types'
import { useCollectScope } from '@regle/core'

const path: GetItemPath & PatchItemPath = '/api/data/analyses/individuals/{id}'

defineEmits<{
  refresh: []
}>()

const { initialValue } = useUpdateDialog(path)

const { r$ } = useCollectScope<[PatchItemRequestMap[typeof path]]>()

const item = computed(() => r$.$value[0])
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
      />
    </template>
  </data-dialog-update>
</template>
