<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'
defineProps<{
  item: GetItemResponseMap['/api/data/media_objects/{id}']
}>()
const vocabularyMediaObjectTypeStore = useVocabularyStore(
  '/api/vocabulary/media_object/types',
)
</script>

<template>
  <data-item-form-read class="w-100">
    <v-row>
      <v-col cols="6">
        <v-container fluid class="pa-0">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                :model-value="item?.originalFilename"
                density="compact"
                label="filename"
                variant="solo-filled"
                flat
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                :model-value="
                  vocabularyMediaObjectTypeStore.getValue(item?.type, 'group')
                "
                density="compact"
                label="group"
                variant="solo-filled"
                flat
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                :model-value="
                  vocabularyMediaObjectTypeStore.getValue(item?.type)
                "
                density="compact"
                label="type"
                variant="solo-filled"
                flat
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                :model-value="item?.description"
                density="compact"
                label="description"
                variant="solo-filled"
                flat
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                :model-value="item?.sha256"
                density="compact"
                label="hash"
                variant="solo-filled"
                flat
                class="text-gray-5"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="6">
        <v-container fluid class="pa-0">
          <v-row justify="center" align="center">
            <v-col cols="6">
              <data-media-object-image :item :size="300" />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
