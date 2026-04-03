<script setup lang="ts" generic="Path extends VocabularyGetCollectionPath">
import type { VocabularyGetCollectionPath, DeleteItemPath } from '~~/types'

type VocabularyGetItemPath = `${Path}/{id}`
defineProps<{
  path: VocabularyGetItemPath & DeleteItemPath
}>()

defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete :path :fullscreen="false" @refresh="$emit('refresh')">
    <template #default="{ item }">
      <lazy-data-item-form-info-vocabulary-value :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
