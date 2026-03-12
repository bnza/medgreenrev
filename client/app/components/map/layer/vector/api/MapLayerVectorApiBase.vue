<script setup lang="ts" generic="P extends GetFeatureCollectionPath">
import { Layers, Styles } from 'vue3-openlayers'
import GeoJSON from 'ol/format/GeoJSON.js'
import type { GetFeatureCollectionPath, GetItemResponseMap } from '~~/types'
import type Feature from 'ol/Feature.js'
import type { Geometry } from 'ol/geom'
import type { FeaturePathToItemPath } from '~/utils/consts/resources'

const props = defineProps<{
  path: P
  idPrefix: string
  labelOptions: TextLabelOptions
  markerOptions?: Partial<StyleCircleOptions>
}>()

const mapVectorApiStore = useMapVectorApiStore(props.path)
const {
  visible,
  opacity,
  labelOptions: storedLabelOptions,
  markerOptions: storedMarkerOptions,
  showNumberMatched,
} = storeToRefs(mapVectorApiStore)

const effectiveRadius = computed(() =>
  showNumberMatched.value ? 12 : storedMarkerOptions.value.radius,
)

storedLabelOptions.value = {
  ...storedLabelOptions.value,
  ...props.labelOptions,
}

mapVectorApiStore.mergeMarkerOptions(props.markerOptions)

type GetItemResponse = GetItemResponseMap[FeaturePathToItemPath<P>] | undefined

// Explicitly define the types for the slots
defineSlots<{
  default(props: { format: GeoJSON }): any
  popUpContent(props: { item: GetItemResponse }): any
  style(): any
}>()

const geoJsonFormat = new GeoJSON({
  dataProjection: 'EPSG:3857', // Configure the dataProjection
})

const { textLabelStyleFn, styleFns, overrideStyleFunction } = storeToRefs(
  useMapVectorApiStyleStore(props.path),
)

styleFns.value = [textLabelStyleFn]

const selectedFeature: Ref<Feature<Geometry> | null> = ref(null)

const interactionSelectRef = useTemplateRef('interactionSelectRef')
const layerRef = useTemplateRef('layerRef')

watch(showNumberMatched, (newValue) => {
  const layer = layerRef.value?.vectorLayer
  if (layer && typeof layer.setDeclutter === 'function') {
    layer.setDeclutter(!newValue)
    layer.changed()
  }
})

provide(CLOSE_MAP_OVERLAY_INJECTION_KEY, () => {
  interactionSelectRef.value?.clearSelection()
})
</script>

<template>
  <Layers.OlVectorLayer
    ref="layerRef"
    :opacity
    :visible
    :declutter="!showNumberMatched"
    :properties="{ path }"
  >
    <slot :format="geoJsonFormat">
      <map-source-api-vector :format="geoJsonFormat" :path>
        <map-interaction-select-layer-vector-api
          ref="interactionSelectRef"
          :path
          :id-prefix
          @feature-selected="selectedFeature = $event"
        />
      </map-source-api-vector>
      <map-overlay-selected-feature-data-card :path :feature="selectedFeature">
        <template #default="{ item }">
          <slot
            name="popUpContent"
            v-bind="{
              item: item as GetItemResponse,
            }"
          />
        </template>
      </map-overlay-selected-feature-data-card>
      <Styles.OlStyle :override-style-function="overrideStyleFunction">
        <slot name="style">
          <Styles.OlStyleCircle :radius="effectiveRadius">
            <Styles.OlStyleFill v-bind="storedMarkerOptions.fill" />
            <Styles.OlStyleStroke v-bind="storedMarkerOptions.stroke" />
          </Styles.OlStyleCircle>
        </slot>
      </Styles.OlStyle>
    </slot>
  </Layers.OlVectorLayer>
</template>
