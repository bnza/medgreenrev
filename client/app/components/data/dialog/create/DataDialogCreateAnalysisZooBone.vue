<script
  setup
  lang="ts"
  generic="
    P extends
      | Extract<GetCollectionPath, '/api/data/analyses/zoo/bones'>
      | '/api/data/zoo/bones/{parentId}/analyses'
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useAnalysisZooBoneValidation'
import { useNormalization } from '~/composables/normalization/useAnalysisZooBoneNormalization'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'zooBone'>
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
    post-path="/api/data/analyses/zoo/bones"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-zoo-bone
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
