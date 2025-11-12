<script
  setup
  lang="ts"
  generic="
    P extends
      | Extract<GetCollectionPath, '/api/data/analyses/potteries'>
      | '/api/data/potteries/{parentId}/analyses'
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useAnalysisPotteryValidation'
import { useNormalization } from '~/composables/normalization/useBaseNormalization'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'pottery'>
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
    post-path="/api/data/analyses/potteries"
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
        subject-path="/api/data/potteries"
        subject-item-title="inventory"
        subject-parent-key="pottery"
        :disable-analysis-on-subject-parent="false"
      />
    </template>
  </data-dialog-create>
</template>
