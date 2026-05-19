<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'

const path: PostCollectionPath =
  '/api/data/analyses/context_botany_taxonomies' as const

defineProps<{
  parent?: ResourceParent<'analysisContextBotany'>
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

    :redirect-option="false"
    @refresh="emit('refresh')"
  >
    <template #default>
      <data-item-form-create-analysis-context-botany-taxonomy :parent />
    </template>
  </data-dialog-create>
</template>
