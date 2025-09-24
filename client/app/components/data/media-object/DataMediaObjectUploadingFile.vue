<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'
import useGetMediaObjectBySha256ItemQuery from '~/composables/queries/useGetMediaObjectBySha256ItemQuery'
import { injectMediaObjectJoin } from '~/composables/injection/useMediaObjectJoin'

const {
  creatingMediaObject,
  uploadingFile: file,
  uploadFileValidationPending,
} = injectMediaObjectJoin()

const props = defineProps<{
  // onClickRemove: () => void
  errors?: string[]
}>()

const {
  data: mediaObject,
  sha256,
  asyncStatus,
} = useGetMediaObjectBySha256ItemQuery()

watch(
  () => file.value,
  async (file) => {
    sha256.value = file ? await calculateSHA256FileHash(file) : ''
  },
  { immediate: true },
)

watch(
  () => mediaObject.value,
  (value) => {
    creatingMediaObject.value = value
  },
)

const isValidItem = (
  value: unknown,
): value is GetItemResponseMap['/api/data/media_objects/{id}'] =>
  isPlainObject(value)

const duplicateMediaError = computed(
  () => props.errors?.filter((e) => e.includes('Duplicate')) || [],
)
const hasDuplicateMediaError = computed(
  () => duplicateMediaError.value?.length > 0,
)

const clear = () => {
  file.value = undefined
  creatingMediaObject.value = undefined
}
</script>

<template>
  <v-file-upload-item
    variant="outlined"
    rounded
    v-bind="props"
    class="pa-2"
    data-testid="data-dialog-form-file-uploading"
  >
    <template #default>
      <v-form v-if="isValidItem(creatingMediaObject)" class="d-flex">
        <v-container v-if="asyncStatus !== 'loading'" fluid>
          <v-row dense class="mb-4">
            <v-col cols="12" sm="6">
              <v-sheet
                :color="hasDuplicateMediaError ? 'error' : 'info'"
                rounded
              >
                <v-container fluid>
                  <v-row v-if="uploadFileValidationPending" dense>
                    <v-icon icon="fas fa-spinner" color="primary" />
                    <span class="ml-2 text-primary">Fetching</span>
                  </v-row>
                  <v-row v-if="hasDuplicateMediaError" dense>
                    <v-icon icon="fas fa-triangle-exclamation" color="white" />
                    <span class="ml-2 text-white">{{
                      duplicateMediaError.join(', ')
                    }}</span>
                  </v-row>
                  <v-row v-else dense>
                    <v-icon icon="fas fa-info-circle" color="primary" />
                    <span class="ml-2 text-primary"
                      >Media already archived. You can anyway proceed to
                      associate it</span
                    >
                  </v-row>
                </v-container>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row dense class="pa-0">
            <data-item-form-info-media-object
              v-if="mediaObject"
              :item="mediaObject"
              :download-link="false"
            />
          </v-row>
        </v-container>
      </v-form>
    </template>
    <template #clear="{ props: clearProps }">
      <v-btn
        v-bind="clearProps"
        data-testid="data-dialog-form-file-uploading-clear"
        class="mx-8"
        rounded="circle"
        size="x-small"
        icon="fas fa-close"
        @click="clear"
      />
    </template>
  </v-file-upload-item>
</template>
