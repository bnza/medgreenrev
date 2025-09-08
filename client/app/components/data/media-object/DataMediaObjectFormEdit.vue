<script setup lang="ts">
import type { DataMediaObjectUploader } from '#components'
import type { PostCollectionResponseMap } from '~~/types'
import { injectMediaObjectJoin } from '~/composables/injection/useMediaObjectJoin'

const {
  creatingMediaObject: model,
  isNewMediaObject,
  uploadingFile: file,
} = injectMediaObjectJoin()

defineProps<{ errors?: string[] }>()

const mediaObjectUploader = useTemplateRef<typeof DataMediaObjectUploader>(
  'mediaObjectUploader',
)

const emit = defineEmits<{
  created: [model: PostCollectionResponseMap['/api/data/media_objects']]
}>()

/**
 * An asynchronous function that synchronizes and updates the `model.value` based on the
 * result of a media object submission.
 *
 * The function attempts to submit the form to create a new media object.
 *
 * If the form submission is successful, the new media object is used to
 * update the `model.value`.
 *
 * Throws:
 * - Error: If `mediaObjectForm` is undefined when a new media object is required.
 */
const sync = async () => {
  if (isNewMediaObject.value) {
    if (!mediaObjectUploader.value) {
      throw new Error(
        'mediaObjectUploader is undefined. If the problem persist contact your server admin',
      )
    }
    const newMediaObject = await mediaObjectUploader.value.submit()
    if (!newMediaObject) {
      return
    }
    model.value = newMediaObject
    emit('created', newMediaObject)
    file.value = undefined
  }
}

defineExpose({
  sync,
})
</script>

<template>
  <v-form data-testid="data-dialog-form" class="ma-4">
    <v-container fluid>
      <v-row dense>
        <v-col cols="12">
          <v-file-upload
            v-model="file"
            clearable
            data-testid="data-dialog-form-file-upload"
          >
            <template #item="{ file: itemFile, props: itemProps }">
              <div
                style="height: 80px"
                class="d-flex justify-center align-center"
              >
                <v-banner
                  v-if="errors && errors.length > 0"
                  class="mb-4"
                  border
                  rounded
                  density="compact"
                  color="error"
                  icon="fas fa-exclamation-triangle"
                  :text="errors.join(', ')"
                  data-testid="data-dialog-form-file-upload-error"
                />
              </div>
              <data-media-object-uploading-file
                v-bind="{
                  file: itemFile,
                  onClickRemove: itemProps['onClick:remove'],
                }"
                :errors
              />
            </template>
          </v-file-upload>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <data-media-object-uploader
            v-if="isNewMediaObject"
            ref="mediaObjectUploader"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
