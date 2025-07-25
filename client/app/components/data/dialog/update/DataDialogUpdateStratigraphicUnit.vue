<script setup lang="ts">
import type { PatchItemRequestMap } from '~~/types'
import { useRegle } from '@regle/core'
import { diff } from 'deep-object-diff'

const { r$ } = useRegle(
  {} as PatchItemRequestMap['/api/stratigraphic_units/{id}'],
  {},
)

const onPreSubmit = (
  oldItem: Record<string, any>,
  item: Record<string, any>,
) => {
  const diffItem = diff(oldItem, item)
  if ('number' in diffItem) diffItem.number = Number(diffItem.number)
  if ('year' in diffItem) diffItem.year = Number(diffItem.year)
  return diffItem
}
</script>

<template>
  <data-dialog-update
    path="/api/stratigraphic_units/{id}"
    title="Stratigraphic Unit"
    v-model:regle="r$"
    :on-pre-submit
  >
    <template #default>
      <data-item-form-edit-stratigraphic-unit
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="update"
      />
    </template>
  </data-dialog-update>
</template>
