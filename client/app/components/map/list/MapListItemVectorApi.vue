<script setup lang="ts">
import type { GetFeatureCollectionPath } from '~~/types'
import { useMapVectorApiStore } from '~/stores/useMapVectorApiStore'

const props = defineProps<{
  path: GetFeatureCollectionPath
  title: string
}>()

const { visible } = storeToRefs(useMapVectorApiStore(props.path))
</script>

<template>
  <v-list-item>
    <template #prepend="{}">
      <v-list-item-action start>
        <v-checkbox-btn v-model="visible" />
      </v-list-item-action>
    </template>
    <v-list-item-title>{{ title }}</v-list-item-title>
  </v-list-item>
</template>
