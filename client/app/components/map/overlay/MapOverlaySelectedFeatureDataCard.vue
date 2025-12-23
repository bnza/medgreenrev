<script setup lang="ts" generic="P extends GetFeatureCollectionPath">
import { Map } from 'vue3-openlayers'
import type Feature from 'ol/Feature.js'
import type { Point, Geometry } from 'ol/geom'
import type {
  GetFeatureCollectionPath,
  GetItemPath,
  GetItemResponseMap,
} from '~~/types'
import { getCenter } from 'ol/extent'

const props = defineProps<{
  path: P
  feature: Feature<Geometry> | null
}>()

const position = computed(() => {
  if (!props.feature) {
    return null
  }
  const geometry = props.feature.getGeometry()
  if (!geometry) {
    return null
  }
  const isPoint = (geom: Geometry): geom is Point =>
    geometry.getType() === 'Point'
  if (isPoint(geometry)) {
    return geometry.getCoordinates()
  }
  return getCenter(geometry.getExtent())
})

const { findApiResourcePath } = useOpenApiStore()
const apiResourcePath = findApiResourcePath(props.path)

const getItemPath: GetItemPath | undefined = apiResourcePath
  ? `${apiResourcePath}/{id}`
  : undefined

defineSlots<{
  default(props: { item: GetItemResponseMap[GetItemPath] | undefined }): any
}>()

const id = computed(() => {
  const featureId = props.feature?.getId()
  if (!featureId) {
    return null
  }
  if (typeof featureId === 'string') {
    const pattern = /\.(\d+)$/
    if (pattern.test(featureId)) {
      return Number(pattern.exec(featureId)?.at(1))
    }
    return null
  }
  return featureId
})
</script>

<template>
  <Map.OlOverlay v-if="position" :position="position" positioning="top-center">
    <data-item-info-box-data-card
      v-if="getItemPath && id"
      :path="getItemPath"
      :iri="id"
    >
      <template #default="{ item }">
        <slot v-bind="{ item }" />
      </template>
    </data-item-info-box-data-card>
  </Map.OlOverlay>
</template>
