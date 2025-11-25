<script setup lang="ts">
import type {
  AbsoluteDatingRequestItem,
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { useCollectScope } from '@regle/core'
import { isEmptyObject } from '~/utils'

defineProps<{
  parent?: ResourceParent<'pottery' | 'analysis'>
}>()

const path: PostCollectionPath = '/api/data/analyses/potteries' as const

const { r$ } =
  useCollectScope<
    [PostCollectionRequestMap[typeof path], AbsoluteDatingRequestItem]
  >()

const emit = defineEmits<{
  refresh: []
}>()

const item = computed(() => {
  const base = r$.$value[0] ?? {}
  base.absDatingAnalysis = isEmptyObject(r$.$value[1]) ? null : r$.$value[1]
  return base
})

const isAbsoluteDatingAnalysis = ref(false)
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
        subject-item-title="inventory"
        subject-parent-key="pottery"
        @selected="
          isAbsoluteDatingAnalysis = $event?.type?.group === 'absolute dating'
        "
      />
      <data-item-form-edit-abs-dating-analysis
        v-if="isAbsoluteDatingAnalysis"
        :initial-value="null"
      />
    </template>
  </data-dialog-create>
</template>
