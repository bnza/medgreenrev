<script setup lang="ts" generic="P extends DynamicVocabularyPath">
import type { DynamicVocabularyPath } from '~~/types'
import { useDynamicVocabularyStore } from '~/stores/useDynamicVocabularyStore'

const props = withDefaults(
  defineProps<{
    path: P
    iris?: Array<string | { '@id'?: string }> | null
    prop?: string
    separator?: string
    placeholder?: string
  }>(),
  {
    iris: () => [],
    prop: 'value',
    separator: ', ',
    placeholder: '—',
  },
)

const refs = computed(() =>
  (props.iris ?? []).map((v) => (typeof v === 'string' ? { '@id': v } : v)),
)

const store = useDynamicVocabularyStore(props.path)

const text = computed(
  () => store.getValuesText(refs.value, props.prop, props.separator).value,
)

const loading = computed(() =>
  refs.value.some((r) => r['@id'] && store.isPending(r['@id']).value),
)
</script>

<template>
  <span>
    <template v-if="text">{{ text }}</template>
    <v-progress-circular
      v-else-if="loading"
      indeterminate
      size="14"
      width="2"
    />
    <template v-else>{{ placeholder }}</template>
  </span>
</template>
