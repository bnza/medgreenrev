<script
  setup
  lang="ts"
  generic="Path extends VocabularyGetCollectionPath, Multiple extends boolean"
>
import type { VocabularyGetCollectionPath } from '~~/types'
import { useGetCollectionVocabularyQuery } from '~/composables/queries/useGetCollectionVocabularyQuery'

const props = defineProps<{
  multiple?: Multiple
  path: Path
}>()

const value = ref('')
const { items, asyncStatus } = useGetCollectionVocabularyQuery(
  props.path,
  value,
)
const model = defineModel<
  (Multiple extends true ? string[] : string) | undefined | null
>({ required: true })
</script>

<template>
  <v-select
    v-model="model"
    :items
    :loading="asyncStatus === 'loading'"
    item-value="@id"
    item-title="value"
    :multiple
  />
</template>
