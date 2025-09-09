<script setup lang="ts" generic="P extends GetItemPath">
import { mergeProps } from 'vue'
import type {
  GetItemPath,
  GetItemResponseMap,
  Iri,
  OperationPathParams,
} from '~~/types/index.js'

const props = defineProps<{
  path: P
  iri: Iri
  title: string
  appPath?: string | undefined
}>()

const visible = ref(false)
const params = computed(() =>
  visible.value
    ? ({
        id: extractIdFromIri(props.iri),
      } as OperationPathParams<P, 'get'>)
    : undefined,
)

const { data: item, status } = useGetItemQuery(props.path, params)

defineSlots<{
  activator(props: Record<string, unknown>): any
  default(props: { item: GetItemResponseMap[P] | undefined }): any
}>()

const id = computed(() => extractIdFromIri(props.iri))
</script>

<template>
  <v-menu v-model="visible">
    <template #activator="{ props: menu }">
      <v-tooltip location="top">
        <template #activator="{ props: tooltip }">
          <slot name="activator" v-bind="mergeProps(menu, tooltip)">
            <v-btn
              color="info"
              v-bind="mergeProps(menu, tooltip)"
              icon="fas fa-circle-info"
              size="xsmall"
              data-testid="data-info-box-activator"
            />
          </slot>
        </template>
        <span>show info</span>
      </v-tooltip>
    </template>
    <template #default>
      <v-card
        prepend-icon="fas fa-circle-info"
        width="500"
        data-testid="info-box-card"
      >
        <template #title>
          <span data-testid="info-box-card-title">{{ title }} </span>
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
            <slot
              v-bind="{ item: item as GetItemResponseMap[P] | undefined }"
            />
          </v-container>
        </template>
        <template v-if="appPath && id" #actions>
          <v-spacer />
          <navigation-resource-item-read
            :id
            :disabled="status !== 'success'"
            :app-path
          />
        </template>
      </v-card>
    </template>
  </v-menu>
</template>
