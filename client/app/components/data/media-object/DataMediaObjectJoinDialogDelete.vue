<script setup lang="ts" generic="P extends DeleteItemPath">
import useDeleteItemMutation from '~/composables/queries/useDeleteItemMutation'
import type { DeleteItemPath, Iri, OperationPathParams } from '~~/types'

const item = defineModel<Iri | undefined>({ required: true })

const props = defineProps<{
  path: P
}>()
const { deleteItem } = useDeleteItemMutation(props.path)

const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

const { addError, addSuccess } = useMessagesStore()

const emit = defineEmits<{
  refresh: []
}>()

const submit = async () => {
  try {
    if (!item.value) {
      return
    }
    status.value = 'pending'
    await deleteItem.mutateAsync({
      id: extractIdFromIri(item.value),
    } as OperationPathParams<P, 'delete'>)
    addSuccess('Successfully deleted media object')
    emit('refresh')
    item.value = undefined
    status.value = 'success'
  } catch (e) {
    addError(e)
    status.value = 'error'
  }
}
</script>

<template>
  <v-dialog :model-value="Boolean(item)" max-width="400px" persistent>
    <v-card data-testid="delete-media-object-card">
      <v-card-text class="text-center">
        <v-container v-if="status === 'pending'" style="height: 150px">
          <v-row align-content="center" class="fill-height" justify="center">
            <v-col class="text-subtitle-1 text-center" cols="12">
              Deleting
            </v-col>
            <v-col cols="6">
              <v-progress-linear
                color="warning"
                height="6"
                indeterminate
                rounded
              />
            </v-col>
          </v-row>
        </v-container>
        <v-container v-else style="height: 150px">
          <v-row align-content="center" class="fill-height" justify="center">
            <v-col class="text-subtitle-1 text-center" cols="12">
              <v-icon icon="fas fa-triangle-exclamation" color="error" />
              <br />
              <br />
              Are you sure you want to delete this media object association?
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="anchor" @click="item = undefined">close</v-btn>
        <v-btn color="error" @click="submit()">delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
