<script setup lang="ts">
import type {
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'

const path: PostCollectionPath = '/api/admin/site_user_privileges' as const

defineProps<{
  parent?: ResourceParent<'archaeologicalSite'> | ResourceParent<'user'>
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
    :redirect-option="false"
    :regle="r$"
    @refresh="emit('refresh')"
  >
    <template #default="{ duplicateItem }">
      <data-item-form-create-site-user-privilege :parent :duplicate-item />
    </template>
  </data-dialog-create>
</template>
