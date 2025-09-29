<script
  setup
  lang="ts"
  generic="P extends Extract<GetCollectionPath, '/api/data/sites'>"
>
import { useCreateValidation } from '~/composables/validation/useSiteValidation'
import { useNormalization } from '~/composables/normalization/useSiteNormalization'
import type { GetCollectionPath } from '~~/types'

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
    post-path="/api/data/sites"
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
