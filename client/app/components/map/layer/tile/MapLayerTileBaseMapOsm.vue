<script setup lang="ts">
import { Sources } from 'vue3-openlayers'
</script>

<template>
  <map-layer-tile-base-map base-map="osm">
    <Sources.OlSourceOsm />
  </map-layer-tile-base-map>
</template>
