<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'

const path: PostCollectionPath = '/api/data/botany/charcoals' as const

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
  <data-dialog-create
    :item
    :parent
    :path
    :regle="r$"

    @refresh="emit('refresh')"
  >
    <template #default="{ duplicateItem }">
      <data-item-form-create-botany-charcoal :parent :duplicate-item />
    </template>
  </data-dialog-create>
</template>
