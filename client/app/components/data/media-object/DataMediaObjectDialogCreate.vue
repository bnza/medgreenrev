<script setup lang="ts">
import type { DataMediaObjectFormEdit } from '#components'
import type { PostCollectionResponseMap } from '~~/types'

const visible = defineModel<boolean>('visible', { required: true })

const mediaObjectForm =
  useTemplateRef<typeof DataMediaObjectFormEdit>('mediaObjectForm')

const disabled = ref(false)

const { addError, addSuccess } = useMessagesStore()

const emit = defineEmits<{
  sync: [response: PostCollectionResponseMap['/api/data/media_objects']]
}>()

const submit = async () => {
  try {
    disabled.value = true
    const item = await mediaObjectForm.value?.sync()
    emit('sync', item)
    visible.value = false
  } catch (e) {
    addError(e)
  } finally {
    disabled.value = false
  }
}
</script>

<template>
  <data-dialog
    :visible
    title="Add media object association"
    data-testid="data-dialog-media-object-create"
  >
    <template #default>
      <data-media-object-form-edit
        ref="mediaObjectForm"
        @created="addSuccess('Successfully created media')"
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
