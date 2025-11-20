<script setup lang="ts">
import type { PostCollectionPath, PostCollectionRequestMap } from '~~/types'
import { useCollectScope } from '@regle/core'

const path: PostCollectionPath = '/api/vocabulary/history/animals' as const

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
      <data-item-form-create-vocabulary-history-animal />
    </template>
  </data-dialog-create>
</template>
