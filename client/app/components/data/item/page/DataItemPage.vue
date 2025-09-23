<script setup lang="ts" generic="Path extends GetItemPath">
import type {
  ApiAclResource,
  GetItemPath,
  GetItemResponseMap,
  Iri,
  OperationPathParams,
} from '~~/types'

const props = defineProps<{
  path: Path
  title?: string
  identifierProp?: string
  iri?: Iri
}>()

defineSlots<{
  default(props: { item: GetItemResponseMap[Path] & ApiAclResource }): any
  dialogs(): any
  'toolbar-append'(): any
}>()

const { routeId } = useAppRoute()
const params = computed<OperationPathParams<Path, 'get'> | undefined>(() => {
  const id = props.iri ? extractIdFromIri(props.iri) : routeId
  return id ? ({ id } as OperationPathParams<Path, 'get'>) : undefined
})

const { data: item, status, error } = useGetItemQuery(props.path, params)

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

const isValidItem = (
  value: unknown,
): value is GetItemResponseMap[Path] & ApiAclResource => {
  return Boolean(value) && typeof value === 'object'
}

const { labels } = useResourceConfig(props.path)
const title = computed(() => props.title || labels[0])
</script>

<template>
  <data-card
    :title
    :identifier
    :loading="status === 'pending'"
    :parent="false"
    :show-back-button="!iri"
  >
    <template #toolbar-append>
      <slot name="toolbar-append" />
    </template>
    <loading-component v-if="status === 'pending'" />
    <resource-not-found v-else-if="error" :error :path="props.path" />
    <v-container v-else-if="isValidItem(item)" class="m-0 p-0 card-container">
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

<style scoped>
.card-container {
  width: 100% !important;
  padding: 0 !important;
  max-width: none !important;
}
</style>
