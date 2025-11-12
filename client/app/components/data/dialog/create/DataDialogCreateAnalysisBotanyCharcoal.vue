<script
  setup
  lang="ts"
  generic="
    P extends
      | Extract<GetCollectionPath, '/api/data/analyses/botany/charcoals'>
      | '/api/data/botany/charcoals/{parentId}/analyses'
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useAnalysisBotanyCharcoalValidation'
import { useNormalization } from '~/composables/normalization/useBaseNormalization'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'botanyCharcoal'>
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
    post-path="/api/data/analyses/botany/charcoals"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-subject
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
        subject-path="/api/data/botany/charcoals"
        subject-item-title="code"
        subject-parent-key="botanyCharcoal"
      />
    </template>
  </data-dialog-create>
</template>
