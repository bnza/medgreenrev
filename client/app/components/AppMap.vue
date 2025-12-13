<script setup lang="ts">
import { Map, Layers, Sources } from 'vue3-openlayers'
import MapLayerVectorApiHistoryLocation from '~/components/map/layer/vector/api/MapLayerVectorApiHistoryLocation.vue'

const mapStore = useMapStore()
const { center, projection, zoom, rotation } = storeToRefs(mapStore)

const viewRef = useTemplateRef<typeof Map.OlView>('viewRef')
const mapRef = useTemplateRef<typeof Map.OlMap>('mapRef')

const updateMapState = () => {
  if (viewRef.value && mapRef.value) {
    const olView = viewRef.value.view
    const olMap = mapRef.value.map

    // Get the extent from the view and map size
    const extent = olView.calculateExtent(olMap.getSize())
    mapStore.updateBbox(extent)

    // Update view state directly from the view object
    mapStore.updateView(
      olView.getCenter(),
      olView.getZoom(),
      olView.getRotation(),
    )
  }
}

const onMoveEnd = () => {
  updateMapState()
}

onMounted(() => {
  updateMapState()
})
</script>

<template>
  <Map.OlMap
    ref="mapRef"
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    style="height: 100%; width: 100%"
    @moveend="onMoveEnd"
  >
    <Map.OlView
      ref="viewRef"
      :center="center"
      :projection="projection"
      :rotation="rotation"
      :zoom="zoom"
      :min-zoom="6"
    />
    <Layers.OlTileLayer>
      <Sources.OlSourceOsm />
    </Layers.OlTileLayer>
    <map-layer-vector-api-history-location />
  </Map.OlMap>
</template>
