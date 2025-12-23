<script setup lang="ts">
import type VectorSource from 'ol/source/Vector'
import type { GeoJSON } from 'ol/format'
import type { Extent } from 'ol/extent'
import type Feature from 'ol/Feature'
import type { ProjectionLike } from 'ol/proj'
import type OLGeometry from 'ol/geom/Geometry'
import type { FeatureCollection } from 'geojson'
import type { GetFeatureCollectionPath } from '~~/types'
import { Sources } from 'vue3-openlayers'
import useGetFeatureCollectionQuery from '~/composables/queries/useGetFeatureCollectionQuery'
import { bbox } from 'ol/loadingstrategy.js'

const props = defineProps<{
  format: GeoJSON
  path: GetFeatureCollectionPath
}>()

const sourceRef = ref<{ source: VectorSource | null } | null>(null)
const getSource = () => sourceRef.value?.source

const bboxExtent = ref<Extent>()
const bboxProjection = ref<ProjectionLike>()

const { data, status, error } = useGetFeatureCollectionQuery(
  props.path,
  bboxExtent,
  bboxProjection,
)

function addFeatures(featureCollection: FeatureCollection) {
  const olSource = sourceRef.value?.source
  if (olSource && featureCollection.features) {
    olSource.clear()
    const olFeatures = props.format.readFeatures(featureCollection)
    olSource.addFeatures(olFeatures)
    return olFeatures
  }
  return []
}

const loader = (
  extent: Extent,
  resolution: number,
  projection: ProjectionLike,
  _success?: (features: Array<Feature<OLGeometry>>) => void,
  _failure?: () => void,
) => {
  bboxExtent.value = extent
  bboxProjection.value = projection
}

watch(
  () => status.value,
  (value) => {
    if (value === 'success' && data.value) {
      return addFeatures(data.value)
    }
  },
)

defineExpose({
  sourceRef,
  getSource,
  fetchFeatures: loader,
  status,
  error,
})

defineSlots<{
  default(): any
}>()
</script>

<template>
  <Sources.OlSourceVector
    ref="sourceRef"
    :loader="loader"
    :format="format"
    :strategy="bbox"
  >
    <slot />
  </Sources.OlSourceVector>
</template>
