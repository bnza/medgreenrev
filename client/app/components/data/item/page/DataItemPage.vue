<script setup lang="ts" generic="Path extends GetItemPath">

import type {GetItemPath, GetItemResponseMap} from "~~/types";

const props = defineProps<{
  path: Path,
  title: string
  identifier?: string
}>()

defineSlots<{
  append(): any
  default(props: { item: GetItemResponseMap[Path] }): any
  'toolbar-append'(): any
}>()

const {routeId} = useAppRoute()
const {getItemQuery} = useRepositoryQuery(props.path)
const {data: item, status, error} = useQuery(getItemQuery, () => ({id: routeId}))

const isValidItem = (value: unknown): value is GetItemResponseMap[Path] => {
  return Boolean(value) && typeof value === 'object'
}
</script>

<template>
  <data-card
    :title
    :identifier
    :loading="status === 'pending'"
  >
  <loading-component v-if="status === 'pending'"/>
  <resource-not-found v-else-if="error" :error :path="props.path"/>
  <slot v-else-if="isValidItem(item)" v-bind="{item}"/>
  <resource-not-found v-else :error="`Unsupported item value`" :path="props.path"/>
  </data-card>
</template>
