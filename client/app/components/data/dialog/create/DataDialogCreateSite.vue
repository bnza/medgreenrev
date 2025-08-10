<script setup lang="ts" generic="P extends PostCollectionPath">
import type { PostCollectionPath } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useSiteValidation'
import { useNormalization } from '~/composables/normalization/useSiteNormalization'

defineProps<{
  path: P
  parentId?: string
}>()

const { getEmptyModel, r$ } = useCreateValidation()

const { onPreCreate: onPreSubmit } = useNormalization()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    :path
    title="Site"
    :parent="undefined"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-site
        v-if="r$.$value"
        v-model:item="r$.$value"
        mode="create"
        :errors="r$.$errors"
      />
    </template>
  </data-dialog-create>
</template>
