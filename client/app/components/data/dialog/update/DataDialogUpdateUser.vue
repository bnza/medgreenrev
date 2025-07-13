<script setup lang="ts">
import { diff } from 'deep-object-diff'
import type { PatchItemRequestMap } from '~~/types'
import { useRegle } from '@regle/core'
import rules from '~/utils/validation/rules/user'

const { r$ } = useRegle(
  {} as PatchItemRequestMap['/api/users/{id}'],
  rules.update,
)

const onPreSubmit = (oldItem: object, item: object) => {
  const diffItem = diff(oldItem, item)
  if (diffItem && 'roles' in diffItem && 'roles' in item) {
    diffItem.roles = item.roles
  }
  return diffItem
}
</script>

<template>
  <data-dialog-update
    path="/api/users/{id}"
    title="User"
    :regle="r$"
    :on-pre-submit
  >
    <template #default>
      <data-item-form-edit-user
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
