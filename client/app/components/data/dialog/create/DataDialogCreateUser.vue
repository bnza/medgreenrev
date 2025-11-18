<script setup lang="ts">
import type { PostCollectionPath, PostCollectionRequestMap } from '~~/types'
import { useCollectScope } from '@regle/core'

const path: PostCollectionPath = '/api/admin/users' as const

const { r$ } = useCollectScope<[PostCollectionRequestMap[typeof path]]>()

const emit = defineEmits<{
  refresh: []
}>()

const item = computed(() => r$.$value[0])

const { openUserPasswordDialog } = useUserPasswordDialog()
</script>

<template>
  <data-dialog-create
    :item
    :parent="undefined"
    :path
    :regle="r$"
    @refresh="emit('refresh')"
    @success="(event) => openUserPasswordDialog(event)"
  >
    <template #default>
      <data-item-form-create-user />
    </template>
  </data-dialog-create>
</template>
