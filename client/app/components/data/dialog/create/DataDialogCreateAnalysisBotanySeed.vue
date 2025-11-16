<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { useCollectScope } from '@regle/core'

defineProps<{
  parent?: ResourceParent<'botanySeed' | 'analysis'>
}>()

const path: PostCollectionPath = '/api/data/analyses/botany/seeds' as const

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
        subject-parent-key="botanySeed"
      />
    </template>
  </data-dialog-create>
</template>
