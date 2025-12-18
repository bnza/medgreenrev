<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'

defineProps<{
  parent?: ResourceParent<'sample'> | ResourceParent<'analysis'>
}>()

const path: PostCollectionPath =
  '/api/data/analyses/samples/microstratigraphy' as const

const { r$ } = useCollectScope<[PostCollectionRequestMap[typeof path]]>()

const emit = defineEmits<{
  refresh: []
}>()

const item = computed(() => r$.$value[0])
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
      <data-item-form-create-analysis-sample-microstratigraphy :parent />
    </template>
  </data-dialog-create>
</template>
