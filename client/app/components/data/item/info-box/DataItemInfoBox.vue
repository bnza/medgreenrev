<script setup lang="ts" generic="P extends GetItemPath">
import { mergeProps } from 'vue'
import type { GetItemPath, GetItemResponseMap, Iri } from '~~/types/index.js'

defineProps<{
  path: P
  iri: Iri
  width?: number
  readLink?: boolean
}>()
const visible = ref(false)

defineSlots<{
  actions(): any
  activator(props: Record<string, unknown>): any
  default(props: { item: GetItemResponseMap[P] | undefined }): any
}>()
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
      <data-item-info-box-data-card v-if="visible" v-bind="$props">
        <template #default="{ item }">
          <slot v-bind="{ item: item as GetItemResponseMap[P] | undefined }" />
        </template>
      </data-item-info-box-data-card>
    </template>
  </v-menu>
</template>
