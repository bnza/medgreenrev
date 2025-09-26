<script setup lang="ts">
import type { ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useAnalysisContextZooValidation'
import { useNormalization } from '~/composables/normalization/useAnalysisContextZooNormalization'

const props = defineProps<{
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
    path="/api/data/analyses/contexts/zoo"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-context-zoo
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
