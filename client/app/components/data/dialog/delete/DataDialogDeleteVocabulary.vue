<script setup lang="ts" generic="Path extends VocabularyGetCollectionPath">
import type { VocabularyGetCollectionPath, DeleteItemPath } from '~~/types'

type VocabularyGetItemPath = `${Path}/{id}`
const props = withDefaults(
  defineProps<{
    path: VocabularyGetItemPath & DeleteItemPath
    propertyName?: string
  }>(),
  {
    propertyName: 'value',
  },
)

defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete :path :fullscreen="false" @refresh="$emit('refresh')">
    <template #default="{ item }">
      <lazy-data-item-form-info-vocabulary-value
        :model-value="getNestedValue(item, props.propertyName)"
        :read-link="false"
      />
    </template>
  </data-dialog-delete>
</template>
