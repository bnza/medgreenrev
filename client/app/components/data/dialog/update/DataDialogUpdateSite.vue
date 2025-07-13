<script setup lang="ts" generic="Path extends ValidationMethodToPath<'update'>">
import type {
  PatchItemRequestMap,
  PostCollectionRequestMap,
  ValidationMethodToPath,
} from '~~/types'
import { useRegle } from '@regle/core'
import rules from '~/utils/validation/rules/site'

const props = defineProps<{
  path: Path
}>()

const { r$ } = useRegle(
  {} as PatchItemRequestMap['/api/sites/{id}'],
  rules.create,
)
</script>

<template>
  <data-dialog-update :path title="Site" :regle="r$">
    <template #default>
      <data-item-form-edit-site
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
      />
    </template>
  </data-dialog-update>
</template>
