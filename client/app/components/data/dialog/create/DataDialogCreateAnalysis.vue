<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/data/analyses'>"
>
import type { GetCollectionPath } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useAnalysisValidation'
import { useNormalization } from '~/composables/normalization/useAnalysisNormalization'

defineProps<{
  path: Path
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
    title="Analysis"
    :path
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
