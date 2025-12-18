<script setup lang="ts">
import type { PostCollectionPath, PostCollectionRequestMap } from '~~/types'

const path: PostCollectionPath = '/api/data/media_objects' as const

const { r$ } = useCollectScope<[PostCollectionRequestMap[typeof path]]>()

const emit = defineEmits<{
  refresh: []
}>()

const item = computed(() => r$.$value[0])
</script>

<template>
  <data-dialog-create
    :item
    :path
    :regle="r$"
    :post-request-options="{
      headers: { 'Content-Type': 'multipart/form-data' },
    }"
    @refresh="emit('refresh')"
  >
    <template #default>
      <data-item-form-create-media-object />
    </template>
  </data-dialog-create>
</template>
