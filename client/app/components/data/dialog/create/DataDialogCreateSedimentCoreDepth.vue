<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/sediment_core_depths'
      | '/api/data/sediment_cores/{parentId}/depths'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import { useCreateValidation } from '~/composables/validation/useSedimentCoreDepthValidation'
import { useNormalization } from '~/composables/normalization/useSedimentCoreDepthNormalization'

const props = defineProps<{
  path: P
  parent?:
    | ResourceParent<'sedimentCore', '/api/data/sediment_cores/{id}'>
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
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
    post-path="/api/data/sediment_core_depths"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-sediment-core-depth
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
