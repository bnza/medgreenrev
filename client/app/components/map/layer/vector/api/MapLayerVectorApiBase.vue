<script setup lang="ts">
import type VectorLayer from 'ol/layer/Vector'
import { Layers, Styles } from 'vue3-openlayers'
import GeoJSON from 'ol/format/GeoJSON.js'
import type { GetFeatureCollectionPath } from '~~/types'

import {
  type NormalizedStyleFunction,
  decorateStyle,
  normalizeBaseStyle,
} from '~/utils/map'

const props = defineProps<{
  path: GetFeatureCollectionPath
  labelOptions: TextLabelOptions
}>()

const { visible, opacity, labelOptions, textLabelStyleFn } = storeToRefs(
  useMapVectorApiStore(props.path),
)

labelOptions.value = { ...labelOptions.value, ...props.labelOptions }

// Explicitly define the types for the slots
defineSlots<{
  default(props: { format: GeoJSON }): any
  style(): any
}>()

const geoJsonFormat = new GeoJSON({
  dataProjection: 'EPSG:3857', // Configure the dataProjection
})

const layerRef = ref<{ vectorLayer: VectorLayer<any> } | null>(null)
const baseStyle = ref<NormalizedStyleFunction | null>(null)

const olLayer = computed(() => layerRef.value?.vectorLayer)

const setStyle = () => {
  if (!olLayer.value) {
    return
  }

  // Pass the base style as a readonly value and set the decorated style function on the layer
  const decorated = baseStyle.value
    ? decorateStyle(baseStyle.value, [textLabelStyleFn.value])
    : null
  olLayer.value.setStyle(decorated)
}

onMounted(async () => {
  // Wait for the <Styles.*> subtree to attach its base style
  await nextTick()
  if (!olLayer.value) {
    return
  }

  // Capture and normalize the component's base style into a StyleFunction (stored as StyleLike)
  const rawBase = olLayer.value.getStyle() ?? null
  baseStyle.value = normalizeBaseStyle(rawBase)
  setStyle()
})

watch(() => labelOptions.value.visible, setStyle)
</script>

<template>
  <Layers.OlVectorLayer ref="layerRef" :opacity :visible :declutter="true">
    <slot :format="geoJsonFormat">
      <map-source-api-vector :format="geoJsonFormat" :path />
    </slot>
    <Styles.OlStyle>
      <slot name="style">
        <Styles.OlStyleCircle :radius="4">
          <Styles.OlStyleFill color="red" />
        </Styles.OlStyleCircle>
      </slot>
    </Styles.OlStyle>
  </Layers.OlVectorLayer>
</template>
