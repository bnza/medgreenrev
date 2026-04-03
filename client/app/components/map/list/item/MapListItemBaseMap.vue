<script setup lang="ts">
import type { BaseMap } from '~~/types'

const props = defineProps<{
  title: string
  baseMap: BaseMap
}>()

const { visible, isSettingsDialogOpen } = storeToRefs(
  useMapBaseMapStore(props.baseMap),
)
</script>

<template>
  <v-list-item>
    <template #prepend="{}">
      <v-list-item-action start>
        <v-checkbox-btn v-model="visible" />
      </v-list-item-action>
    </template>
    <v-list-item-title>{{ title }}</v-list-item-title>
    <template #append="appendProps">
      <slot name="append" v-bind="appendProps">
        <map-list-menu-base>
          <v-list-item @click="isSettingsDialogOpen = true">
            <v-list-item-title>Settings</v-list-item-title>
            <template #append><v-icon icon="fas fa-cog" /></template>
            <map-dialog-base-map :base-map :title />
          </v-list-item>
        </map-list-menu-base>
      </slot>
    </template>
  </v-list-item>
</template>
