<script
  setup
  lang="ts"
  generic="
    P extends
      | Extract<GetCollectionPath, '/api/data/analyses/contexts/botany'>
      | '/api/data/contexts/{parentId}/analyses/botany'
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useAnalysisContextBotanyValidation'
import { useNormalization } from '~/composables/normalization/useAnalysisContextBotanyNormalization'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'context', '/api/data/contexts/{id}'>
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
    post-path="/api/data/analyses/contexts/botany"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-context-botany
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
