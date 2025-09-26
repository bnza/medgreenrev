<script setup lang="ts">
import { useCreateValidation } from '~/composables/validation/useUserValidation'
import { useNormalization } from '~/composables/normalization/useUserNormalization'

defineProps<{
  parentId?: string
}>()

const { getEmptyModel, r$ } = useCreateValidation()

const { onPreCreate: onPreSubmit } = useNormalization()

const { openUserPasswordDialog } = useUserPasswordDialog()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    :parent-id
    path="/api/admin/users"
    :on-pre-submit
    :get-empty-model
    @success="(event) => openUserPasswordDialog(event)"
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-user
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
