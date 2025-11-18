<script setup lang="ts">
import type { GetItemPath, PatchItemPath, PatchItemRequestMap } from '~~/types'
import { useCollectScope } from '@regle/core'
import DataItemFormUpdateHistoryAnimal from '~/components/data/item/form/update/DataItemFormUpdateHistoryAnimal.vue'

const path: GetItemPath & PatchItemPath = '/api/data/history/animals/{id}'

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
      <data-item-form-update-history-animal
        v-if="initialValue"
        :initial-value
        :fetched-item
      />
    </template>
  </data-dialog-update>
</template>
