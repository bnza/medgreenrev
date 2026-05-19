<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import DataItemFormCreatePaleoclimateSample from '~/components/data/item/form/create/DataItemFormCreatePaleoclimateSample.vue'

const path: PostCollectionPath = '/api/data/paleoclimate_samples' as const

defineProps<{
  parent?: ResourceParent<'paleoclimateSamplingSite'>
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
      <data-item-form-create-paleoclimate-sample :parent :duplicate-item/>
    </template>
  </data-dialog-create>
</template>
