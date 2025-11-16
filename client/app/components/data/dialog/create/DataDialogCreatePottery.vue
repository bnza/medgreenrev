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

const item = computed(() => r$.$value[0])
</script>

<template>
  <data-dialog-create :item :path :regle="r$" @refresh="emit('refresh')">
    <template #default>
      <data-item-form-create-pottery :parent />
    </template>
  </data-dialog-create>
</template>
