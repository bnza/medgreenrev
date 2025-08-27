<script setup lang="ts" generic="P extends PostCollectionPath">
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'
import type { PostCollectionPath, PostCollectionRequestMap } from '~~/types'
import { useRegle } from '@regle/core'
import { required, withMessage } from '@regle/rules'
import { DataMediaObjectFormEdit } from '#components'

const props = defineProps<{
  path: P
  parentIri: string
}>()
const visible = defineModel<boolean>({ required: true })

const { addSuccess, addError } = useMessagesStore()

const { postCollection } = usePostCollectionMutation(props.path)

const disabled = ref(false)

const emit = defineEmits<{
  refresh: []
}>()

const file = ref<File>()

const defaultModel = () => ({
  mediaObject: undefined,
  item: props.parentIri,
})
const model = ref<{
  mediaObject?: string
  item: string
}>(defaultModel())

const uniqueMediaObject = useApiUniqueValidator(
  '/api/validator/unique/media_objects/stratigraphic_units/{mediaObject}/{item}',
  ['mediaObject', 'item'],
  'Duplicate [media, stratigraphic unit] combination',
)

const { r$ } = useRegle(model, {
  mediaObject: {
    required: withMessage(required, 'File is required'),
    uniqueMediaObject: uniqueMediaObject(() => model.value.item),
  },
})

const isNewMediaObject = computed(() => !r$.$value.mediaObject && file.value)

const mediaObjectForm =
  useTemplateRef<typeof DataMediaObjectFormEdit>('mediaObjectForm')

const isInvalid = (regle: typeof r$) =>
  Object.values<string[]>(regle.$errors).some(
    (propErrors) => propErrors.length > 0,
  ) &&
  Object.values<string[]>(regle.$silentErrors).some(
    (propErrors) => propErrors.length > 0,
  )

const submit = async () => {
  try {
    disabled.value = true
    if (isNewMediaObject.value) {
      if (!mediaObjectForm.value) {
        addError(
          'Media object form is not defined. Contact support if this error persists.',
        )
        return
      }
      const newMediaObject = await mediaObjectForm.value.submit()
      if (!newMediaObject) {
        return
      }
      model.value.mediaObject = newMediaObject['@id']
    }

    await r$.$validate()
    if (isInvalid(r$)) {
      return
    }
    if (r$.$invalid) {
      console.debug(
        'r$.$invalid mismatch',
        toRaw(r$.$invalid),
        toRaw(r$.$errors),
        toRaw(r$.$silentErrors),
      )
    }
    const requestModel = toRaw(model.value) as PostCollectionRequestMap[P]
    await postCollection.mutateAsync({ model: requestModel })
    addSuccess('Successfully created media object association')
    emit('refresh')
    visible.value = false
  } catch (e) {
    addError(e)
  } finally {
    disabled.value = false
  }
}

watch(
  () => visible.value,
  (flag) => {
    if (!flag) {
      file.value = undefined
      r$.$value = defaultModel()
      r$.$reset()
    }
  },
)
</script>

<template>
  <data-dialog :visible title="Add media object association">
    <template #default>
      <v-form data-testid="data-dialog-form" class="ma-4">
        <v-container fluid>
          <v-row dense>
            <v-col cols="12">
              <v-file-upload v-model="file" clearable>
                <template #item="{ file: itemFile, props: itemProps }">
                  <data-media-object-uploading-file
                    v-bind="{
                      file: itemFile,
                      onClickRemove: itemProps['onClick:remove'],
                    }"
                    :errors="r$.$errors.mediaObject"
                    @found="r$.$value.mediaObject = $event"
                  />
                </template>
              </v-file-upload>
            </v-col>
          </v-row>
          <v-row style="min-height: 60px" justify="center">
            <v-col cols="12" col="4">
              <v-banner
                v-if="
                  r$.$errors.mediaObject && r$.$errors.mediaObject.length > 0
                "
                type="error"
                border
                rounded
                density="compact"
                color="error"
                icon="fas fa-exclamation-triangle"
                :text="r$.$errors.mediaObject.join(', ')"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <data-media-object-form-edit
                v-if="isNewMediaObject && typeof file !== 'undefined'"
                ref="mediaObjectForm"
                :file
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </template>
    <template #actions>
      <v-col class="d-flex justify-center">
        <v-btn
          data-testid="data-dialog-form-close-button"
          :disabled
          @click="visible = false"
          >close
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-center">
        <v-btn
          color="secondary"
          data-testid="data-dialog-form-submit-button"
          :disabled
          @click="submit"
          >submit
        </v-btn>
      </v-col>
    </template>
  </data-dialog>
</template>
