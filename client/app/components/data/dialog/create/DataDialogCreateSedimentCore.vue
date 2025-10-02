<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      '/api/data/sediment_cores' | '/api/data/sites/{parentId}/sediment_cores'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useSedimentCoreValidation'
import { useNormalization } from '~/composables/normalization/useSedimentCoreNormalization'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'site', '/api/data/sites/{id}'>
}>()

const { getEmptyModel, r$ } = useCreateValidation(props.parent)

const { onPreCreate: onPreSubmit } = useNormalization()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    :parent
    :path
    post-path="/api/data/sediment_cores"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-sediment-core
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
