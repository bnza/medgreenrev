<script setup lang="ts" generic="Path extends VocabularyGetCollectionPath">
import type { VocabularyGetCollectionPath } from '~~/types'
import { useGetCollectionVocabularyQuery } from '~/composables/queries/useGetCollectionVocabularyQuery'

const props = defineProps<{
  path: Path
}>()
const value = ref('')
const { items, asyncStatus } = useGetCollectionVocabularyQuery(
  props.path,
  value,
)
const model = defineModel<string[] | undefined>({ required: true })
</script>

<template>
  <v-select
    v-model="model"
    :items
    :loading="asyncStatus === 'loading'"
    item-value="@id"
    item-title="value"
    multiple
  />
</template>
