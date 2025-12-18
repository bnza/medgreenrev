<script setup lang="ts" generic="P extends GetFeatureCollectionPath">
import { Layers, Styles } from 'vue3-openlayers'
import GeoJSON from 'ol/format/GeoJSON.js'
import type { GetFeatureCollectionPath, GetItemResponseMap } from '~~/types'
import type Feature from 'ol/Feature.js'
import type { Geometry } from 'ol/geom'
import type { FeaturePathToItemPath } from '~/utils/consts/resources'

const props = defineProps<{
  path: P
  labelOptions: TextLabelOptions
}>()

const { visible, opacity, labelOptions } = storeToRefs(
  useMapVectorApiStore(props.path),
)

labelOptions.value = { ...labelOptions.value, ...props.labelOptions }

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

const layerRef = useTemplateRef<typeof Layers.OlVectorLayer>('layerRef')
const olLayer = computed(() => layerRef.value?.vectorLayer ?? null)

const { textLabelStyleFn, styleFns } = storeToRefs(
  useMapVectorApiStyleStore(props.path, olLayer),
)

styleFns.value = [textLabelStyleFn]

const selectedFeature: Ref<Feature<Geometry> | null> = ref(null)
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
      <Styles.OlStyle>
        <slot name="style">
          <Styles.OlStyleCircle :radius="4">
            <Styles.OlStyleFill color="red" />
          </Styles.OlStyleCircle>
        </slot>
      </Styles.OlStyle> </slot
  ></Layers.OlVectorLayer>
</template>
