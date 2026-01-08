<script setup lang="ts">
import { transform } from 'ol/proj'

const props = withDefaults(
  defineProps<{
    x: number | undefined
    y: number | undefined
    sourceSrs?: string
    destinationSrs?: string
    zoom?: number
    labelX?: string
    labelY?: string
    hintTemplate?: string
  }>(),
  {
    sourceSrs: 'EPSG:4326',
    destinationSrs: 'EPSG:3857',
    zoom: 12,
    labelX: 'coordinate E',
    labelY: 'coordinate N',
    hintTemplate: 'Decimal Degrees WGS84',
  },
)

const { state: mode } = storeToRefs(useAppUiModeStore())
const { updateView } = useMapStore()

const coordinates = computed(() => [props.x, props.y])

const hint = computed(() => `${props.hintTemplate} (${props.sourceSrs})`)

const isValidCoordinate = computed(() => isValid2DCoordinate(coordinates.value))

const goToLocation = () => {
  mode.value = 'map'
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
  <v-row>
    <v-col cols="6" xs="12" class="px-2">
      <v-text-field
        readonly
        :model-value="y"
        :label="labelY"
        :hint
        persistent-hint
      >
        <template #prepend>
          <v-btn
            class="mr-4"
            density="compact"
            :icon="true"
            :disabled="!isValidCoordinate"
            @click="goToLocation()"
          >
            <v-icon icon="fas fa-location" color="primary" />
            <v-tooltip activator="parent" location="bottom"
              >go to location</v-tooltip
            >
          </v-btn>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="6" xs="12" class="px-2">
      <v-text-field
        readonly
        :model-value="x"
        :label="labelX"
        :hint
        persistent-hint
      />
    </v-col>
  </v-row>
</template>

<style scoped></style>
