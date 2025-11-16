<script setup lang="ts">
import type { PostCollectionPath, PostCollectionRequestMap } from '~~/types'
import { useCollectScope } from '@regle/core'

const path: PostCollectionPath = '/api/data/sites' as const

const { r$ } = useCollectScope<[PostCollectionRequestMap[typeof path]]>()

const emit = defineEmits<{
  refresh: []
}>()

const item = computed(() => r$.$value[0])
</script>

<template>
  <data-dialog-create
    :item
    :parent="undefined"
    :path
    :regle="r$"
    @refresh="emit('refresh')"
  >
    <template #default>
      <data-item-form-create-site />
    </template>
  </data-dialog-create>
</template>
