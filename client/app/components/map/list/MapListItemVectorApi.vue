<script setup lang="ts">
import type { GetFeatureCollectionPath } from '~~/types'
import { useMapVectorApiStore } from '~/stores/useMapVectorApiStore'

const props = defineProps<{
  path: GetFeatureCollectionPath
  title: string
}>()

const { visible, labelVisible } = storeToRefs(useMapVectorApiStore(props.path))
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
          <v-checkbox-btn v-model="labelVisible" label="Show labels" />
        </map-list-menu-base>
      </slot>
    </template>
  </v-list-item>
</template>
