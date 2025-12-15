<script setup lang="ts">
import { Layers, Styles } from 'vue3-openlayers'
import GeoJSON from 'ol/format/GeoJSON.js'
import type { GetFeatureCollectionPath } from '~~/types'

const props = defineProps<{
  path: GetFeatureCollectionPath
}>()

const { visible, opacity } = storeToRefs(useMapVectorApiStore(props.path))

// Explicitly define the types for the slots
defineSlots<{
  default(props: { format: GeoJSON }): any
  style(): any
}>()

const geoJsonFormat = new GeoJSON({
  dataProjection: 'EPSG:3857', // Configure the dataProjection
})
</script>

<template>
  <Layers.OlVectorLayer :opacity :visible>
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
