<script setup lang="ts">
import type { PostCollectionRequestMap, ResourceParent } from '~~/types'
import { useCollectScope } from '@regle/core'

defineProps<{
  parent?: ResourceParent<'zooTooth' | 'analysis'>
}>()

const path = '/api/data/analyses/zoo/teeth'
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
      <data-item-form-create-analysis-subject
        :parent
        subject-item-title="code"
        subject-parent-key="zooTooth"
      />
    </template>
  </data-dialog-create>
</template>
