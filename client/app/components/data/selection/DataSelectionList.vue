<script setup lang="ts" generic="Path extends ListGetCollectionPath">
import type { ListGetCollectionPath } from '~~/types'
import { useGetCollectionListQuery } from '~/composables/queries/useGetCollectionListQuery'

const props = withDefaults(
  defineProps<{
    path: Path
    combobox?: boolean
    queryParams?: Record<string, any>
  }>(),
  { combobox: true },
)

const search = ref('')
const innerQueryParams = toRef(props, 'queryParams')
watch(innerQueryParams, () => (search.value = ''), { deep: true })
const { items, asyncStatus } = useGetCollectionListQuery(
  props.path,
  search,
  innerQueryParams,
)

const model = defineModel<string | null | undefined>({ required: true })

const primitiveItems = computed(() => [
  ...new Set(
    items.value.filter((item) => Boolean(item)).map((item) => item.value),
  ),
])
</script>

<template>
  <v-combobox
    v-if="combobox"
    v-model="model"
    v-model:search="search"
    :items="primitiveItems"
    :loading="asyncStatus === 'loading'"
    clearable
  />
  <v-autocomplete
    v-else
    v-model="model"
    v-model:search="search"
    :items="primitiveItems"
    :loading="asyncStatus === 'loading'"
    clearable
  />
</template>
