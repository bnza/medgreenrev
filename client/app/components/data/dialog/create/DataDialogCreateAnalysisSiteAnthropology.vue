<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/sites/anthropology'
      | '/api/data/analyses/{parentId}/sites/anthropology'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useAnalysisSiteAnthropologyValidation'
import { useNormalization } from '~/composables/normalization/useAnalysisSiteAnthropologyNormalization'

const props = defineProps<{
  path: P
  parent?:
    | ResourceParent<'site', '/api/data/sites/{id}'>
    | ResourceParent<'analysis', '/api/data/analyses/{id}'>
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
    post-path="/api/data/analyses/sites/anthropology"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-analysis-site-anthropology
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
