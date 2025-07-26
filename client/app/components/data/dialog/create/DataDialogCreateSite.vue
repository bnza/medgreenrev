<script setup lang="ts" generic="Path extends ValidationMethodToPath<'create'>">
import type { PostCollectionRequestMap, ValidationMethodToPath } from '~~/types'
import { createRule, type Maybe, useRegle } from '@regle/core'
import { required } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'

defineProps<{
  path: Path
  parentId?: string
}>()

const apiValidator = new GetValidationOperation(
  '/api/validator/unique/sites/code/{id}',
)

const unique = createRule({
  validator: async (value: Maybe<string>) => {
    return typeof value === 'string'
      ? await apiValidator.isValid({ id: value })
      : true
  },
  message: 'Code must be unique',
})

const { r$ } = useRegle({} as PostCollectionRequestMap['/api/sites'], {
  code: { required, unique },
  name: {
    required,
  },
})
</script>

<template>
  <data-dialog-create v-model:regle="r$" :path title="Site" :parent-id>
    <template #default>
      <data-item-form-edit-site
        v-if="r$.$value"
        v-model:item="r$.$value"
        mode="create"
        :errors="r$.$errors"
      />
    </template>
  </data-dialog-create>
</template>
