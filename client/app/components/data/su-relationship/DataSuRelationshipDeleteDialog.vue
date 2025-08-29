<script setup lang="ts">
import { injectStratigraphicUnitsRelationship } from '~/composables/injection/useStratigraphicUnitsRelationship'
import useDeleteItemMutation from '~/composables/queries/useDeleteItemMutation'

const {
  isDeleteDialogOpen,
  submitStatus,
  deletingParams,
  deletingRelationshipIri,
} = injectStratigraphicUnitsRelationship()

const emit = defineEmits<{
  refresh: []
}>()

const { deleteItem, invalidatedCacheEntries } = useDeleteItemMutation(
  '/api/data/stratigraphic_unit_relationships/{id}',
)

const { addSuccess, addError } = useMessagesStore()

const submit = async () => {
  if (deletingParams.value) {
    try {
      submitStatus.value = 'pending'
      await deleteItem.mutateAsync(deletingParams.value)
      // If no cache hits, probably query cache has been deleted
      // so we need to force a refresh of the collection
      if (!invalidatedCacheEntries.value.length) {
        emit('refresh')
      }
      addSuccess('Successfully deleted item')
      deletingRelationshipIri.value = undefined
      submitStatus.value = 'success'
    } catch (e) {
      addError(e)
      submitStatus.value = 'error'
    }
  }
}
</script>

<template>
  <v-dialog
    :model-value="isDeleteDialogOpen"
    max-width="400px"
    @after-leave="deletingRelationshipIri = undefined"
  >
    <v-card data-testid="delete-su-relationship-card">
      <v-card-text class="text-center">
        <v-icon icon="fas fa-triangle-exclamation" color="error" />
        <br />
        <br />
        Are you sure you want to delete this relationship?
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="submitStatus === 'pending'"
          color="error"
          @click="submit"
          >delete</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
