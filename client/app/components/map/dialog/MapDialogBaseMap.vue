<script setup lang="ts">
import type { BaseMap } from '~~/types'

const props = defineProps<{
  title: string
  baseMap: BaseMap
}>()
const { isSettingsDialogOpen, opacity, visible } = storeToRefs(
  useMapBaseMapStore(props.baseMap),
)
</script>

<template>
  <v-dialog v-model="isSettingsDialogOpen" persistent>
    <v-card width="400">
      <v-card-title>Setting</v-card-title>
      <v-card-subtitle>{{ title }}</v-card-subtitle>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <map-opacity-slider v-model="opacity" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-checkbox v-model="visible" label="Show" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <layout-action-two-buttons>
          <v-btn text @click="isSettingsDialogOpen = false">Close</v-btn>
        </layout-action-two-buttons>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
