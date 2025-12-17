<script setup lang="ts">
import { Layers, Styles } from 'vue3-openlayers'
import GeoJSON from 'ol/format/GeoJSON.js'
import type { GetFeatureCollectionPath } from '~~/types'

const props = defineProps<{
  path: GetFeatureCollectionPath
  labelOptions: TextLabelOptions
}>()

const { visible, opacity, labelOptions } = storeToRefs(
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

const layerRef = useTemplateRef<typeof Layers.OlVectorLayer>('layerRef')
const olLayer = computed(() => layerRef.value?.vectorLayer ?? null)

const { textLabelStyleFn, styleFns } = storeToRefs(
  useMapVectorApiStyleStore(props.path, olLayer),
)

styleFns.value = [textLabelStyleFn]
</script>

<template>
  <Layers.OlVectorLayer
    ref="layerRef"
    :opacity
    :visible
    :declutter="true"
    :properties="{ path }"
  >
    <slot :format="geoJsonFormat">
      <map-source-api-vector :format="geoJsonFormat" :path>
        <map-interaction-select-layer-vector-api
          ref="interactionSelectRef"
          :path
        />
      </map-source-api-vector>
      <Styles.OlStyle>
        <slot name="style">
          <Styles.OlStyleCircle :radius="4">
            <Styles.OlStyleFill color="red" />
          </Styles.OlStyleCircle>
        </slot>
      </Styles.OlStyle> </slot
  ></Layers.OlVectorLayer>
</template>
