<script setup lang="ts">
import type { PostCollectionPath, PostCollectionRequestMap } from '~~/types'

const path: PostCollectionPath =
  '/api/data/paleoclimate_sampling_sites' as const

const { r$ } = useCollectScope<[PostCollectionRequestMap[typeof path]]>()

const emit = defineEmits<{
  refresh: []
}>()

const { item } = useCreateBaseItem(r$)
</script>

<template>
  <data-dialog-create
    :item
    :parent="undefined"
    :path
    :regle="r$"

    @refresh="emit('refresh')"
  >
    <template #default="{ duplicateItem }">
      <data-item-form-create-paleoclimate-sampling-site :duplicate-item/>
    </template>
  </data-dialog-create>
</template>
