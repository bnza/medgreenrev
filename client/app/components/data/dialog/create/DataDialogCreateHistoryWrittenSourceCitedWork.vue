<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'

const path: PostCollectionPath =
  '/api/data/history/written_sources_cited_works' as const

defineProps<{
  parent?: ResourceParent<'historyWrittenSource' | 'vocHistoryHistoryCitedWork'>
}>()

const { r$ } = useCollectScope<[PostCollectionRequestMap[typeof path]]>()

const emit = defineEmits<{
  refresh: []
}>()

const { item } = useCreateBaseItem(r$)
</script>

<template>
  <data-dialog-create :item :path :regle="r$"  @refresh="emit('refresh')">
    <template #default="{ duplicateItem }">
      <data-item-form-create-history-written-source-cited-work :parent :duplicate-item/>
    </template>
  </data-dialog-create>
</template>
