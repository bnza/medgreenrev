<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
const path: PostCollectionPath =
  '/api/data/analyses/sediment_core_depth_botany_taxonomies' as const
defineProps<{
  parent?: ResourceParent<'analysisSedimentCoreDepthBotany'>
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
      <data-item-form-create-analysis-sediment-core-depth-botany-taxonomy
        :parent
      />
    </template>
  </data-dialog-create>
</template>
