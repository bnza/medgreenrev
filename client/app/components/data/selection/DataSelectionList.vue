<script setup lang="ts" generic="Path extends ListGetCollectionPath">
import type { ListGetCollectionPath } from '~~/types'
import { useGetCollectionListQuery } from '~/composables/queries/useGetCollectionListQuery'

const props = withDefaults(
  defineProps<{
    path: Path
    combobox?: boolean
  }>(),
  { combobox: true },
)

const search = ref('')
const { items, asyncStatus } = useGetCollectionListQuery(props.path, search)
const model = defineModel<string | null | undefined>({ required: true })

const primitiveItems = computed(() =>
  items.value.filter((item) => Boolean(item)).map((item) => item.value),
)
</script>

<template>
  <v-combobox
    v-if="combobox"
    v-model="model"
    v-model:search="search"
    :items="primitiveItems"
    :loading="asyncStatus === 'loading'"
  />
  <v-autocomplete
    v-else
    v-model="model"
    v-model:search="search"
    :items="primitiveItems"
    :loading="asyncStatus === 'loading'"
  />
</template>
