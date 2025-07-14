<script setup lang="ts" generic="Path extends ValidationMethodToPath<'create'>">
import type { PostCollectionRequestMap, ValidationMethodToPath } from '~~/types'
import { useRegle } from '@regle/core'
import rules from '~/utils/validation/rules/site'

const props = defineProps<{
  path: Path
}>()

const { r$ } = useRegle(
  {} as PostCollectionRequestMap['/api/sites'],
  rules.create,
)
</script>

<template>
  <data-dialog-create :path title="Site" :regle="r$">
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
