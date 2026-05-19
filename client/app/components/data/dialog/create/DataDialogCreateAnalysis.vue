<script setup lang="ts">
import type { PostCollectionPath, PostCollectionRequestMap } from '~~/types'

const path = '/api/data/analyses' satisfies PostCollectionPath

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
      <data-item-form-create-analysis :duplicate-item/>
    </template>
  </data-dialog-create>
</template>
