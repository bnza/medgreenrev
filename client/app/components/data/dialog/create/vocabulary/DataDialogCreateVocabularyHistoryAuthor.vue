<script setup lang="ts">
import type { PostCollectionPath, PostCollectionRequestMap } from '~~/types'

const path: PostCollectionPath = '/api/vocabulary/history/authors' as const

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
    :redirect-option="false"
    @refresh="emit('refresh')"
  >
    <template #default>
      <data-item-form-create-vocabulary-history-author />
    </template>
  </data-dialog-create>
</template>
