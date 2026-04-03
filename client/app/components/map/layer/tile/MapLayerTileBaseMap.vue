<script setup lang="ts">
import type { BaseMap } from '~~/types'
import { Layers } from 'vue3-openlayers'

const props = defineProps<{
  baseMap: BaseMap
}>()
const { visible, opacity } = storeToRefs(useMapBaseMapStore(props.baseMap))
</script>

<template>
  <Layers.OlTileLayer :opacity :visible>
    <slot />
  </Layers.OlTileLayer>
</template>
