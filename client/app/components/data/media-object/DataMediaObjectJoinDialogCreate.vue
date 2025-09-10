<script setup lang="ts" generic="P extends PostCollectionPath">
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'
import type {
  Iri,
  PostCollectionPath,
  PostCollectionRequestMap,
} from '~~/types'
import { useRegle } from '@regle/core'
import { required, withMessage } from '@regle/rules'
import type { DataMediaObjectFormEdit } from '#components'
import { injectMediaObjectJoin } from '~/composables/injection/useMediaObjectJoin'

const props = defineProps<{
  path: P
  parentIri: Iri
}>()

const {
  isCreateDialogOpen: visible,
  creatingMediaObjectJoin: model,
  creatingMediaObject,
  uploadingFile,
} = injectMediaObjectJoin()

const { addSuccess, addError } = useMessagesStore()

const { postCollection } = usePostCollectionMutation(props.path)

const disabled = ref(false)

const emit = defineEmits<{
  refresh: []
}>()

const uniqueMediaObject = useApiUniqueValidator(
  '/api/validator/unique/media_objects/stratigraphic_units/{mediaObject}/{item}',
  ['mediaObject', 'item'],
  'Duplicate [media, stratigraphic unit] combination',
)

const { r$ } = useRegle(model, {
  mediaObject: {
    //@ts-expect-error something wrong with regle (Vue: Property [" TypeError"] is missing in type)
    required: withMessage(required, 'File is required'),
    //@ts-expect-error something wrong with regle (Vue: Property [" TypeError"] is missing in type)
    uniqueMediaObject: uniqueMediaObject(() => model.value.item),
  },
})

const mediaObjectForm =
  useTemplateRef<typeof DataMediaObjectFormEdit>('mediaObjectForm')

const submit = async () => {
  try {
    disabled.value = true
    await mediaObjectForm.value?.sync()

    r$.$reset()
    await nextTick()

    const { valid, data } = await r$.$validate()

    if (!valid) {
      console.log('Form is invalid, stopping submission')
      return
    }

    await postCollection.mutateAsync({
      model: data as PostCollectionRequestMap[P],
    })
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
      creatingMediaObject.value = undefined
      uploadingFile.value = undefined
      r$.$reset()
    }
  },
)
</script>

<template>
  <data-dialog
    :visible
    title="Add media association"
    data-testid="data-dialog-media-object-join-create"
  >
    <template #default>
      <data-media-object-form-edit
        ref="mediaObjectForm"
        :error="r$.$errors.mediaObject as any"
      />
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
