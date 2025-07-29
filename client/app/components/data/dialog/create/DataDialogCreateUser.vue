<script setup lang="ts" generic="P extends PostCollectionPath">
import type { PostCollectionPath } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useUserValidation'
import { useNormalization } from '~/composables/normalization/useUserNormalization'

defineProps<{
  path: P
  parentId?: string
}>()

const { getEmptyModel, r$ } = useCreateValidation()

const { onPreCreate: onPreSubmit } = useNormalization()

const { openUserPasswordDialog } = useUserPasswordDialog()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    title="User"
    :parent-id
    :path
    :on-pre-submit
    :get-empty-model
    @success="(event) => openUserPasswordDialog(event)"
  >
    <template #default>
      <data-item-form-edit-user
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
