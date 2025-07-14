<script setup lang="ts">
import type { PatchItemRequestMap } from '~~/types'
import { useRegle } from '@regle/core'
import rules from '~/utils/validation/rules/site'

const { r$ } = useRegle(
  {} as PatchItemRequestMap['/api/sites/{id}'],
  rules.create,
)
</script>

<template>
  <data-dialog-update path="/api/sites/{id}" title="Site" v-model:regle="r$">
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
