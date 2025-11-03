<script
  setup
  lang="ts"
  generic="P extends Extract<GetCollectionPath, '/api/data/history/plants'>"
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useHistoryPlantValidation'
import { useNormalization } from '~/composables/normalization/useHistoryPlantNormalization'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'historyLocation'>
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
    post-path="/api/data/history/plants"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-history-plant
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
