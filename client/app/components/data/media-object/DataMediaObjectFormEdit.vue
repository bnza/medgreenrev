<script setup lang="ts">
import type { DataMediaObjectUploader } from '#components'
import type { PostCollectionResponseMap } from '~~/types'
const file = ref<File | undefined>()
const model = defineModel<
  PostCollectionResponseMap['/api/data/media_objects'] | undefined
>()

defineProps<{ errors?: string[] }>()

/**
 * A computed property that determines whether the current entity is a new media object.
 *
 * The value is derived based on the truthiness of two conditions:
 * - `model.value` is falsy.
 * - `file.value` is truthy.
 *
 * Returns `true` if `model.value` is not set and `file.value` is set, indicating a new media object. Otherwise, returns `false`.
 */
const isNewMediaObject = computed(() => !model.value && file.value)

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

const validationPending = ref(false)

watch(
  () => file.value,
  (newFile, oldFile) => {
    // If a new file is selected (different from the previous one)
    if (newFile && newFile !== oldFile) {
      // Reset the model to allow the uploader to show
      model.value = undefined
    }
  },
)

defineExpose({
  sync,
})
</script>

<template>
  <v-form data-testid="data-dialog-form" class="ma-4">
    <v-container fluid>
      <v-row dense>
        <v-col cols="12">
          <v-file-upload v-model="file" clearable>
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
                />
              </div>
              <data-media-object-uploading-file
                v-bind="{
                  file: itemFile,
                  onClickRemove: itemProps['onClick:remove'],
                }"
                :errors
                :validation-pending
                @found="model = $event"
              />
            </template>
          </v-file-upload>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <data-media-object-uploader
            v-show="isNewMediaObject && typeof file !== 'undefined'"
            ref="mediaObjectUploader"
            :file
            @update:validation-pending="validationPending = $event"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
