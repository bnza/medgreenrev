<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    x: number | undefined
    y: number | undefined
    sourceSrs?: string
    destinationSrs?: string
    zoom?: number
    iconSize?: string | number
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
    iconSize: 'default',
  },
)

const hint = computed(() => `${props.hintTemplate} (${props.sourceSrs})`)
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
          <navigation-map-location-coordinate v-bind="props" />
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
