<script
  setup
  lang="ts"
  generic="
    P extends
      | Extract<GetCollectionPath, '/api/data/analyses/zoo/teeth'>
      | '/api/data/zoo/teeth/{parentId}/analyses'
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useAnalysisZooToothValidation'
import { useNormalization } from '~/composables/normalization/useAnalysisZooToothNormalization'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'zooTooth'>
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
    post-path="/api/data/analyses/zoo/teeth"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <data-item-form-edit-analysis-zoo-tooth
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
