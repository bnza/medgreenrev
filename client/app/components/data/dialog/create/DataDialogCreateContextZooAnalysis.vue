<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/contexts/zoo'
      | '/api/data/contexts/{parentId}/analyses/zoo'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useContextZooAnalysisValidation'
import { useNormalization } from '~/composables/normalization/useContextZooAnalysisNormalization'

const props = defineProps<{
  path: Path
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
    title="Zooarchaeological context analysis"
    :parent
    :path
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-context-zoo-analysis
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
