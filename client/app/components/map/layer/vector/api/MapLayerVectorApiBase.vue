<script setup lang="ts">
import { Layers, Styles } from 'vue3-openlayers'
import GeoJSON from 'ol/format/GeoJSON.js'

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
  <Layers.OlVectorLayer>
    <slot :format="geoJsonFormat" />
    <Styles.OlStyle>
      <slot name="style">
        <Styles.OlStyleCircle :radius="4">
          <Styles.OlStyleFill color="red" />
        </Styles.OlStyleCircle>
      </slot>
    </Styles.OlStyle>
  </Layers.OlVectorLayer>
</template>
