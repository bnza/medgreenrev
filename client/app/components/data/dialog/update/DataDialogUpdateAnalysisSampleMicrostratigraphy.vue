<script setup lang="ts">
import type { GetItemPath, PatchItemPath, PatchItemRequestMap } from '~~/types'

const path: GetItemPath & PatchItemPath =
  '/api/data/analyses/samples/microstratigraphy/{id}'

defineEmits<{
  refresh: []
}>()

const { initialValue, fetchedItem } = useUpdateDialog(path)

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
      <data-item-form-update-analysis-sample-microstratigraphy
        v-if="initialValue"
        :initial-value
        :fetched-item
      />
    </template>
  </data-dialog-update>
</template>
