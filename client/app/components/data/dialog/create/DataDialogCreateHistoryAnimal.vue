<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { useCollectScope } from '@regle/core'
import DataItemFormCreateHistoryAnimal from '~/components/data/item/form/create/DataItemFormCreateHistoryAnimal.vue'

const path: PostCollectionPath = '/api/data/history/animals' as const

defineProps<{
  parent?: ResourceParent<'historyLocation'>
}>()

const { r$ } = useCollectScope<[PostCollectionRequestMap[typeof path]]>()

const emit = defineEmits<{
  refresh: []
}>()

const item = computed(() => r$.$value[0])
</script>

<template>
  <data-dialog-create :item :path :regle="r$" @refresh="emit('refresh')">
    <template #default>
      <data-item-form-create-history-animal :parent />
    </template>
  </data-dialog-create>
</template>
