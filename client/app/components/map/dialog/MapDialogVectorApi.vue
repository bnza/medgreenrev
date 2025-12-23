<script setup lang="ts" generic="P extends GetFeatureCollectionPath">
import type { GetFeatureCollectionPath } from '~~/types'

const props = defineProps<{
  path: P
}>()

const mapVectorApiStore = useMapVectorApiStore(props.path)

const { visible, labelVisible, isSettingsDialogOpen } =
  storeToRefs(mapVectorApiStore)
</script>

<template>
  <v-dialog v-model="isSettingsDialogOpen" persistent>
    <v-card width="400">
      <v-card-title>Setting</v-card-title>
      <v-card-subtitle>{{
        mapVectorApiStore.resourceConfig.labels[1]
      }}</v-card-subtitle>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-checkbox v-model="visible" label="Show layer" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-checkbox v-model="labelVisible" label="Show labels" />
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
