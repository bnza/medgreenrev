<script setup lang="ts">
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
  parentPath: GetFeatureCollectionPath
  childPath: GetFeatureCollectionPath
  feature: Feature<Geometry> | null
}>()

defineSlots<{
  default(props: { item: GetItemResponseMap[GetItemPath] | undefined }): any
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

const parentApiResourcePath = findApiResourcePath(props.parentPath)
const parentGetItemPath = parentApiResourcePath
  ? (`${parentApiResourcePath}/{id}` as const)
  : undefined

const parentResourceConfig = parentApiResourcePath
  ? useResourceConfig(parentApiResourcePath)
  : undefined

const childApiResourcePath = findApiResourcePath(props.childPath)
const childResourceConfig = childApiResourcePath
  ? useResourceConfig(childApiResourcePath)
  : undefined

const id = computed(() => {
  const id = props.feature?.get('id') as number | undefined
  if (id) {
    return id
  }
  console.error('Feature has no id')
  return null
})

const numberMatched = computed(
  () => props.feature?.get('number_matched') as number | null | undefined,
)

const childSegment = props.childPath.replace('/api/features/', '')

const subCollectionRoute = computed(() => {
  if (!parentResourceConfig?.appPath || !id.value) return null
  return `${parentResourceConfig.appPath}/${id.value}/${childSegment}`
})

const { push } = useHistoryStackStore()
const { fullPath } = useRoute()
const { state: uiMode } = storeToRefs(useAppUiModeStore())

const closeOverlay = inject(CLOSE_MAP_OVERLAY_INJECTION_KEY, null)
const viewSubCollection = () => {
  closeOverlay?.()
  push(fullPath)
  uiMode.value = 'default'
}
</script>

<template>
  <Map.OlOverlay v-if="position" :position="position" positioning="top-center">
    <data-item-info-box-data-card
      v-if="parentGetItemPath && id"
      :path="parentGetItemPath"
      :iri="id"
    >
      <template #default="{ item }">
        <slot :item>
          <v-list v-if="item" density="compact">
            <v-list-item
              v-if="'name' in item && item.name"
              :title="String(item.name)"
            />
            <v-list-item
              v-if="'code' in item && item.code"
              :subtitle="String(item.code)"
            />
          </v-list>
        </slot>
      </template>
      <template #actions>
        <v-spacer />
        <v-chip
          v-if="numberMatched && childResourceConfig && subCollectionRoute"
          class="ma-2"
          color="primary"
          size="small"
          prepend-icon="fas fa-layer-group"
          nuxt
          :to="subCollectionRoute"
          @click="viewSubCollection"
        >
          {{ numberMatched }} {{ childResourceConfig.labels[1] }}
          <v-tooltip activator="parent" location="bottom">
            View {{ childResourceConfig.labels[1] }}
          </v-tooltip>
        </v-chip>
      </template>
    </data-item-info-box-data-card>
  </Map.OlOverlay>
</template>
