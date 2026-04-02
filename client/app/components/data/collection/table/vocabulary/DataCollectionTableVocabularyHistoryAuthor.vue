<script setup lang="ts">
import type { CollectionAcl } from '~~/types'
import DataDialogCreateVocabularyHistoryAuthor from '~/components/data/dialog/create/vocabulary/DataDialogCreateVocabularyHistoryAuthor.vue'

const path = '/api/data/vocabulary/history/authors'

const { appPath } = useResourceConfig(path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/vocabulary/history/authors/{id}'),
)
const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>

<template>
  <data-collection-table :path @acl="acl = { ...acl, ...$event }">
    <template #[`item.id`]="{ item }">
      <v-btn-group>
        <navigation-resource-item-delete
          :id="item.id"
          :disabled="!item._acl.canDelete"
          :app-path
          @delete="deleteDialogState = { id: item.id }"
        />
      </v-btn-group>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-create-vocabulary-history-author @refresh="refetch()" />
      <data-dialog-delete-history-author @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
