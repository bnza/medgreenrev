<script setup lang="ts">
import type { PostCollectionRequestMap, ResourceParent } from '~~/types'

const path = '/api/data/stratigraphic_units' as const

defineProps<{
  parent?: ResourceParent<'archaeologicalSite'>
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
    :path
    :regle="r$"
    @refresh="emit('refresh')"
  >
    <template #default="{ duplicateItem }">
      <data-item-form-create-stratigraphic-unit
        :parent
        :duplicate-item
      />
    </template>
  </data-dialog-create>
</template>
