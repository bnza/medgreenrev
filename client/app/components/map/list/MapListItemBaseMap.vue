<script setup lang="ts">
import type { BaseMap } from '~~/types'

const props = defineProps<{
  title: string
  baseMap: BaseMap
}>()

const { visible, opacity } = storeToRefs(useMapBaseMapStore(props.baseMap))
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
          <map-opacity-slider v-model="opacity" />
        </map-list-menu-base>
      </slot>
    </template>
  </v-list-item>
</template>
