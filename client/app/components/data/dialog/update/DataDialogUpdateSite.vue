<script setup lang="ts">
import type { PatchItemRequestMap } from '~~/types'
import { useRegle } from '@regle/core'
import rules from '~/utils/validation/rules/site'
import { diff } from 'deep-object-diff'

const { r$ } = useRegle(
  {} as PatchItemRequestMap['/api/sites/{id}'],
  rules.create,
)
const onPreSubmit = (
  oldItem: Record<string, any>,
  item: Record<string, any>,
) => {
  const diffItem = diff(oldItem, item)
  if ('chronologyLower' in diffItem)
    diffItem.chronologyLower = Number(diffItem.chronologyLower)
  if ('chronologyUpper' in diffItem)
    diffItem.chronologyUpper = Number(diffItem.chronologyUpper)
  return diffItem
}
</script>

<template>
  <data-dialog-update
    path="/api/sites/{id}"
    title="Site"
    v-model:regle="r$"
    :on-pre-submit
  >
    <template #default>
      <data-item-form-edit-site
        v-if="r$.$value"
        mode="update"
        v-model:item="r$.$value"
        :errors="r$.$errors"
      />
    </template>
  </data-dialog-update>
</template>
