<script setup lang="ts">
import { transform } from 'ol/proj'

const props = withDefaults(
  defineProps<{
    x: number | undefined
    y: number | undefined
    sourceSrs?: string
    destinationSrs?: string
    zoom?: number
    iconSize?: string | number
  }>(),
  {
    sourceSrs: 'EPSG:4326',
    destinationSrs: 'EPSG:3857',
    zoom: 12,
    iconSize: 'default',
  },
)

const { state: mode } = storeToRefs(useAppUiModeStore())
const { updateView } = useMapStore()

const coordinates = computed(() => [props.x, props.y])

const isValidCoordinate = computed(() => isValid2DCoordinate(coordinates.value))
const showTooltip = ref(false)

const goToLocation = () => {
  mode.value = 'map'
  showTooltip.value = false
  if (!isValid2DCoordinate(coordinates.value)) {
    console.warn('Invalid coordinate provided:', coordinates.value)
    return
  }
  updateView(
    transform(coordinates.value, props.sourceSrs, props.destinationSrs),
    props.zoom,
  )
}
</script>

<template>
  <v-btn
    density="compact"
    icon
    :disabled="!isValidCoordinate"
    variant="text"
    @click="goToLocation()"
  >
    <v-icon icon="fas fa-location" color="primary" :size="iconSize" />
    <v-tooltip v-model="showTooltip" activator="parent" location="bottom"
      >go to location</v-tooltip
    >
  </v-btn>
</template>
