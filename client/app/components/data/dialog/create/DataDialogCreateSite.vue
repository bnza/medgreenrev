<script setup lang="ts" generic="Path extends ValidationMethodToPath<'create'>">
import type { PostCollectionRequestMap, ValidationMethodToPath } from '~~/types'
import { useRegle } from '@regle/core'
import rules from '~/utils/validation/rules/site'

defineProps<{
  path: Path
  parentId?: string
}>()

const { r$ } = useRegle(
  {} as PostCollectionRequestMap['/api/sites'],
  rules.create,
)
</script>

<template>
  <data-dialog-create :path title="Site" v-model:regle="r$" :parent-id>
    <template #default>
      <data-item-form-edit-site
        v-if="r$.$value"
        mode="create"
        v-model:item="r$.$value"
        :errors="r$.$errors"
      />
    </template>
  </data-dialog-create>
</template>
