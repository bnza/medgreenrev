<script setup lang="ts">
import type { GetFeatureCollectionPath } from '~~/types'
import { useMapVectorApiStore } from '~/stores/useMapVectorApiStore'
import useGetFeatureCollectionExtentQuery from '~/composables/queries/useGetFeatureCollectionExtentQuery'

const props = defineProps<{
  path: GetFeatureCollectionPath
  title: string
}>()

const mapVectorApiStore = useMapVectorApiStore(props.path)

const { visible, isSettingsDialogOpen } = storeToRefs(mapVectorApiStore)

const isMenuOpen = ref(false)

const openSettingsDialog = () => {
  isMenuOpen.value = false
  isSettingsDialogOpen.value = true
}

const { state: uiMode } = storeToRefs(useAppUiModeStore())
// const getCollectionPath = API_FEATURES_RESOURCE_MAP[props.path]
const router = useRouter()
const { isSearchDialogOpen } = storeToRefs(
  useResourceUiStore(mapVectorApiStore.resourceConfig.apiPath),
)
const openSearchDialog = () => {
  uiMode.value = 'default'
  router.push(mapVectorApiStore.resourceConfig.appPath)
  isSearchDialogOpen.value = true
}

const extentQueryEnabled = ref(false)
const { data: extentData, refresh: refreshExtent } =
  useGetFeatureCollectionExtentQuery(
    props.path,
    extentQueryEnabled,
    'EPSG:3857',
  )

const { updateBbox } = useMapStore()

const zoomToExtent = async () => {
  extentQueryEnabled.value = true
  await refreshExtent()
  const newExtent = extentData.value?.extent

  if (newExtent) {
    updateBbox(newExtent)
  }
}
</script>

<template>
  <v-list-item>
    <template #prepend="{}">
      <v-list-item-action start>
        <v-checkbox-btn v-model="visible" />
      </v-list-item-action>
    </template>
    <v-list-item-title>{{ title }}</v-list-item-title>
    <template #append="appendProps">
      <slot name="append" v-bind="appendProps">
        <map-list-menu-base>
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
          <v-list-item @click="openSettingsDialog">
            <v-list-item-title>Settings</v-list-item-title>
            <template #append><v-icon icon="fas fa-cog" /></template>
            <map-dialog-vector-api :path />
          </v-list-item>
        </map-list-menu-base>
      </slot>
    </template>
  </v-list-item>
</template>
