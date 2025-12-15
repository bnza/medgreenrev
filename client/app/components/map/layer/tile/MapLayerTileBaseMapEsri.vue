<script setup lang="ts">
import { Sources } from 'vue3-openlayers'
</script>

<template>
  <map-layer-tile-base-map base-map="esri">
    <Sources.OlSourceXyz
      attribution="@ Tiles ESRI"
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    />
  </map-layer-tile-base-map>
</template>
