<script setup lang="ts">
import type { GetFeatureCollectionPath } from '~~/types'
import { useMapVectorApiStore } from '~/stores/useMapVectorApiStore'
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'
import useGetFeatureCollectionExtentQuery from '~/composables/queries/useGetFeatureCollectionExtentQuery'

const props = defineProps<{
  path: GetFeatureCollectionPath
  groupKey: FeatureAggregationResourceKey
  title: string
}>()

const { isAuthenticated } = useAppAuth()

const mapVectorApiStore = useMapVectorApiStore(props.path, props.groupKey)

const {
  visible,
  isSettingsDialogOpen,
  isExportDialogOpen,
  markerOptions,
  isAggregatable,
  showNumberMatched,
} = storeToRefs(mapVectorApiStore)

const isMenuOpen = ref(false)

const openSettingsDialog = () => {
  isMenuOpen.value = false
  isSettingsDialogOpen.value = true
}

const openExportDialog = () => {
  isMenuOpen.value = false
  isExportDialogOpen.value = true
}

const { state: uiMode } = storeToRefs(useAppUiModeStore())

const router = useRouter()
const { isSearchDialogOpen } = storeToRefs(
  useResourceUiStore(mapVectorApiStore.resourceConfig.apiPath),
)

const openAttributeTable = () => {
  isMenuOpen.value = false
  uiMode.value = 'default'
  router.push(mapVectorApiStore.resourceConfig.appPath)
}
const openSearchDialog = () => {
  isMenuOpen.value = false
  openAttributeTable()
  isSearchDialogOpen.value = true
}

const extentQueryEnabled = ref(false)
const { data: extentData, refresh: refreshExtent } =
  useGetFeatureCollectionExtentQuery(
    props.path,
    props.groupKey,
    extentQueryEnabled,
    'EPSG:3857',
  )

const { updateBbox } = useMapStore()

const zoomToExtent = async () => {
  isMenuOpen.value = false
  extentQueryEnabled.value = true
  await refreshExtent()
  const newExtent = extentData.value?.extent

  if (newExtent) {
    updateBbox(newExtent)
  }
}
</script>

<template>
  <v-list-item :data-testid="`map-list-item-vector-api-${path}`">
    <template #prepend="{}">
      <v-list-item-action start>
        <v-checkbox-btn v-model="visible" />
        <map-list-item-marker-circle :options="markerOptions" />
      </v-list-item-action>
    </template>
    <v-list-item-title>{{ title }}</v-list-item-title>
    <template #append="appendProps">
      <slot name="append" v-bind="appendProps">
        <map-list-menu-base v-model="isMenuOpen">
          <v-list-item v-if="isAggregatable">
            <v-switch
              v-model="showNumberMatched"
              label="Show counts"
              density="compact"
              hide-details
            />
          </v-list-item>
          <v-list-item @click="openAttributeTable">
            <v-list-item-title>Open table</v-list-item-title>
            <template #append><v-icon icon="fas fa-table-list" /></template>
          </v-list-item>
          <v-list-item @click="openSearchDialog">
            <v-list-item-title>Search</v-list-item-title>
            <template #append
              ><v-icon icon="fas fa-magnifying-glass"
            /></template>
          </v-list-item>
          <v-list-item @click="zoomToExtent">
            <v-list-item-title>Zoom to layer extent</v-list-item-title>
            <template #append><v-icon icon="fas fa-expand" /></template>
          </v-list-item>
          <v-list-item v-if="isAuthenticated" @click="openExportDialog">
            <v-list-item-title>Download</v-list-item-title>
            <template #append><v-icon icon="fas fa-download" /></template>
          </v-list-item>
          <v-list-item @click="openSettingsDialog">
            <v-list-item-title>Settings</v-list-item-title>
            <template #append><v-icon icon="fas fa-cog" /></template>
          </v-list-item>
        </map-list-menu-base>
        <map-dialog-export-feature-collection :path :group-key="groupKey" />
        <map-dialog-vector-api :path :group-key="groupKey" />
      </slot>
    </template>
  </v-list-item>
</template>
