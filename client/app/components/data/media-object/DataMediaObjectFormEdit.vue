<script setup lang="ts">
import type { DataMediaObjectUploader } from '#components'
const file = ref<File | undefined>()
const model = defineModel<string | undefined>()

defineProps<{ errors?: string[] }>()
const isNewMediaObject = computed(() => !model.value && file.value)

const mediaObjectForm =
  useTemplateRef<typeof DataMediaObjectUploader>('mediaObjectForm')

/**
 * An asynchronous function that synchronizes and updates the `model.value` based on the
 * result of a media object submission.
 *
 * The function attempts to submit the form to create a new media object.
 *
 * If the form submission is successful, the new media object's `@id` property is used to
 * update the `model.value`.
 *
 * Throws:
 * - Error: If `mediaObjectForm` is undefined when a new media object is required.
 */
const sync = async () => {
  if (isNewMediaObject.value) {
    if (!mediaObjectForm.value) {
      throw new Error('mediaObjectForm is undefined')
    }
    const newMediaObject = await mediaObjectForm.value.submit()
    if (!newMediaObject) {
      return
    }
    model.value = newMediaObject['@id']
  }
}

const validationPending = ref(false)

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
            ref="mediaObjectForm"
            :file
            @update:validation-pending="validationPending = $event"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
