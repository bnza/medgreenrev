<script setup lang="ts" generic="Path extends GetItemPath">
import type {
  GetItemPath,
  GetItemResponseMap,
  OperationPathParams,
} from '~~/types'

const props = defineProps<{
  path: Path
  title: string
  identifierProp?: string
}>()

defineSlots<{
  default(props: { item: GetItemResponseMap[Path] }): any
  dialogs(): any
}>()

const { routeId } = useAppRoute()

const { queryOptions } = useDefineGetItemQuery(props.path)
const {
  data: item,
  status,
  error,
} = useQuery(
  queryOptions,
  () => ({ id: routeId }) as OperationPathParams<Path, 'get'>,
)

const identifier = computed(() => {
  if (
    props.identifierProp &&
    item.value &&
    props.identifierProp in item.value
  ) {
    const value = (item.value as Record<string, unknown>)[props.identifierProp]
    return typeof value === 'string' ? value : undefined
  }
  return undefined
})

const isValidItem = (value: unknown): value is GetItemResponseMap[Path] => {
  return Boolean(value) && typeof value === 'object'
}
</script>

<template>
  <data-card :title :identifier :loading="status === 'pending'">
    <loading-component v-if="status === 'pending'" />
    <resource-not-found v-else-if="error" :error :path="props.path" />
    <v-container class="m-0 p-0" v-else-if="isValidItem(item)">
      <slot v-bind="{ item }" />
      <slot name="dialogs" />
    </v-container>
    <resource-not-found
      v-else
      error="Unsupported item value"
      :path="props.path"
    />
  </data-card>
</template>
