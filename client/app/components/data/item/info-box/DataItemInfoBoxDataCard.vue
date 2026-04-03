<script setup lang="ts" generic="P extends GetItemPath">
import type {
  GetItemPath,
  GetItemResponseMap,
  Iri,
  OperationPathParams,
} from '~~/types/index.js'

const props = withDefaults(
  defineProps<{
    path: P
    iri: Iri | number
    width?: number
    readLink?: boolean
  }>(),
  {
    width: 500,
    readLink: true,
  },
)
const id = computed(() =>
  typeof props.iri === 'number' ? props.iri : extractIdFromIri(props.iri),
)

const params = computed(
  () =>
    ({
      id: id.value,
    }) as OperationPathParams<P, 'get'>,
)

const { data: item, status } = useGetItemQuery(props.path, params)

defineSlots<{
  actions(): any
  activator(props: Record<string, unknown>): any
  default(props: { item: GetItemResponseMap[P] | undefined }): any
}>()

const { labels, appPath } = useResourceConfig(props.path)
</script>

<template>
  <v-card prepend-icon="fas fa-circle-info" :width data-testid="info-box-card">
    <template #title>
      <span data-testid="info-box-card-title">{{ labels[0] }} </span>
    </template>
    <template #text>
      <v-container class="pa-0" fluid>
        <v-skeleton-loader
          v-if="status === 'pending'"
          type="list-item-avatar-two-line"
        />
        <v-alert
          v-else-if="status === 'error'"
          icon="fas fa-circle-exclamation"
          text="Data fetch failed"
          data-testid="info-box-card-error"
        />
        <slot v-bind="{ item: item as GetItemResponseMap[P] | undefined }" />
      </v-container>
    </template>
    <template v-if="readLink" #actions>
      <slot name="actions">
        <v-spacer />
        <navigation-resource-item-read
          :id
          :disabled="status !== 'success'"
          :app-path
        />
      </slot>
    </template>
  </v-card>
</template>
