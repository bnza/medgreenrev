<script setup lang="ts" generic="P extends GetFeatureCollectionPath">
import { Layers, Styles } from 'vue3-openlayers'
import GeoJSON from 'ol/format/GeoJSON.js'
import type {
  GetFeatureCollectionPath,
  GetItemResponseMap,
  GetItemPath,
} from '~~/types'
import type Feature from 'ol/Feature.js'
import type { Geometry } from 'ol/geom'
import type { FeaturePathToItemPath } from '~/utils/consts/resources'

import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'

const props = defineProps<{
  path: P
  groupKey: FeatureAggregationResourceKey
  idPrefix: string
  labelOptions: TextLabelOptions
  markerOptions?: Partial<StyleCircleOptions>
}>()

const mapVectorApiStore = useMapVectorApiStore(props.path, props.groupKey)
const {
  visible,
  opacity,
  labelOptions: storedLabelOptions,
  markerOptions: storedMarkerOptions,
  showNumberMatched,
  parentFeaturePath,
} = storeToRefs(mapVectorApiStore)

const { isAggregatable } = mapVectorApiStore

const effectiveRadius = computed(() =>
  showNumberMatched.value ? 12 : storedMarkerOptions.value.radius,
)

storedLabelOptions.value = {
  ...storedLabelOptions.value,
  ...props.labelOptions,
}

mapVectorApiStore.mergeMarkerOptions(props.markerOptions)

type GetItemResponse = GetItemResponseMap[FeaturePathToItemPath<P>] | undefined

type ParentItemResponse = GetItemResponseMap[GetItemPath] | undefined

// Explicitly define the types for the slots
defineSlots<{
  default(props: { format: GeoJSON }): any
  popUpContent(props: { item: GetItemResponse }): any
  aggregatedPopUpContent(props: { item: ParentItemResponse }): any
  style(): any
}>()

const geoJsonFormat = new GeoJSON({
  dataProjection: 'EPSG:3857', // Configure the dataProjection
})

const { textLabelStyleFn, styleFns, overrideStyleFunction } = storeToRefs(
  useMapVectorApiStyleStore(props.path, props.groupKey),
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
      <map-source-api-vector
        :format="geoJsonFormat"
        :path
        :group-key="groupKey"
      >
        <map-interaction-select-layer-vector-api
          ref="interactionSelectRef"
          :path
          :group-key="groupKey"
          :id-prefix
          @feature-selected="selectedFeature = $event"
        />
      </map-source-api-vector>
      <map-overlay-selected-aggregated-feature-data-card
        v-if="isAggregatable && parentFeaturePath"
        :parent-path="parentFeaturePath"
        :child-path="path"
        :feature="selectedFeature"
      >
        <template #default="{ item }">
          <slot
            name="aggregatedPopUpContent"
            v-bind="{
              item: item as ParentItemResponse,
            }"
          />
        </template>
      </map-overlay-selected-aggregated-feature-data-card>
      <map-overlay-selected-feature-data-card
        v-else
        :path
        :feature="selectedFeature"
      >
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
