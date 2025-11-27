<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'
import { useMediaObject } from '~/composables/useMediaObject'
const props = withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/media_objects/{id}']
    downloadLink?: boolean
  }>(),
  {
    downloadLink: true,
  },
)
const vocabularyMediaObjectTypeStore = useVocabularyStore(
  '/api/vocabulary/media_object/types',
)
const { mediaUrl } = useMediaObject(props.item)

const { isAuthenticated } = useAppAuth()
</script>

<template>
  <data-item-form-read class="w-100">
    <v-row justify="end">
      <v-col cols="2">
        <v-checkbox
          v-if="isAuthenticated"
          :model-value="item?.public"
          label="public"
        />
      </v-col>
      <v-col cols="6" />
    </v-row>
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
              <v-card class="pa-0" width="300" flat rounded variant="outlined">
                <data-media-object-image :item :size="300" />
                <template #actions>
                  <v-spacer />
                  <v-btn
                    v-if="downloadLink"
                    class="mr-4"
                    density="compact"
                    :icon="true"
                    data-testid="download-media-button"
                    :href="mediaUrl"
                    target="_blank"
                    download
                  >
                    <v-icon icon="fas fa-download" />
                    <v-tooltip activator="parent" location="bottom"
                      >download</v-tooltip
                    >
                  </v-btn>
                </template>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
