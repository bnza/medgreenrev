<script setup lang="ts">
import type { PostCollectionPath, PostCollectionRequestMap } from '~~/types'

const path: PostCollectionPath = '/api/data/sampling_sites' as const

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
      <data-item-form-create-sampling-site />
    </template>
  </data-dialog-create>
</template>
