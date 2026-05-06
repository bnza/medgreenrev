<script setup lang="ts" generic="P extends DynamicVocabularyPath">
import type { DynamicVocabularyPath } from '~~/types'
import { useDynamicVocabularyStore } from '~/stores/useDynamicVocabularyStore'

const props = withDefaults(
  defineProps<{
    path: P
    iri?: string | { '@id'?: string } | null
    prop?: string
    placeholder?: string
  }>(),
  {
    iri: null,
    prop: 'value',
    placeholder: '—',
  },
)

const iri = computed<string | undefined>(() => {
  const v = props.iri
  if (!v) return undefined
  return typeof v === 'string' ? v : v['@id']
})

const store = useDynamicVocabularyStore(props.path)

const value = computed(() => store.getValue(iri.value, props.prop).value)
const loading = computed(() => store.isPending(iri.value).value)
</script>

<template>
  <v-progress-circular
    v-if="loading && value === undefined"
    indeterminate
    size="14"
    width="2"
  />
  <span v-else>{{ value ?? placeholder }}</span>
</template>
