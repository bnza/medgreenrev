<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { useCollectScope } from '@regle/core'

const path: PostCollectionPath = '/api/data/potteries' as const

defineProps<{
  parent?: ResourceParent<'stratigraphicUnit'>
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
      <data-item-form-create-pottery :parent :duplicate-item/>
    </template>
  </data-dialog-create>
</template>
