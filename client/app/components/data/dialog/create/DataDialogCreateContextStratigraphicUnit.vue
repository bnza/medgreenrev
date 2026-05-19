<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'

const path: PostCollectionPath =
  '/api/data/context_stratigraphic_units' as const

defineProps<{
  parent?: ResourceParent<'context'> | ResourceParent<'stratigraphicUnit'>
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
      <data-item-form-create-context-stratigraphic-unit :parent :duplicate-item/>
    </template>
  </data-dialog-create>
</template>
