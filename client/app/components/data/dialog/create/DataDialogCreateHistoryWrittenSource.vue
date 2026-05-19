<script setup lang="ts">
import type { PostCollectionPath, PostCollectionRequestMap } from '~~/types'

const path: PostCollectionPath = '/api/data/history/written_sources' as const

const { r$ } = useCollectScope<[PostCollectionRequestMap[typeof path]]>()

const emit = defineEmits<{
  refresh: []
}>()

const { item } = useCreateBaseItem(r$)
</script>

<template>
  <data-dialog-create :item :path :regle="r$"  @refresh="emit('refresh')">
    <template #default="{ duplicateItem }">
      <data-item-form-create-history-written-source :duplicate-item/>
    </template>
  </data-dialog-create>
</template>
