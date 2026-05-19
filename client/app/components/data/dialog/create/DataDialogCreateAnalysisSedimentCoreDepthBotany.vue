<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
const path: PostCollectionPath =
  '/api/data/analyses/sediment_core_depths/botany' as const
defineProps<{
  parent?: ResourceParent<'sedimentCoreDepth'> | ResourceParent<'analysis'>
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
    <template #default>
      <data-item-form-create-analysis-sediment-core-depth-botany :parent />
    </template>
  </data-dialog-create>
</template>
