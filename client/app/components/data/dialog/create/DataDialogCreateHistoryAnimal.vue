<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import DataItemFormCreateHistoryAnimal from '~/components/data/item/form/create/DataItemFormCreateHistoryAnimal.vue'

const path: PostCollectionPath = '/api/data/history/animals' as const

defineProps<{
  parent?: ResourceParent<'vocHistoryLocation'>
}>()

const { r$ } = useCollectScope<[PostCollectionRequestMap[typeof path]]>()

const emit = defineEmits<{
  refresh: []
}>()

const { item } = useCreateBaseItem(r$)
</script>

<template>
  <data-dialog-create :item :path :regle="r$"  @refresh="emit('refresh')">
    <template #default="{ duplicateItem }">
      <data-item-form-create-history-animal :parent :duplicate-item/>
    </template>
  </data-dialog-create>
</template>
