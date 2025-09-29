<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/admin/site_user_privileges'
      | '/api/admin/sites/{parentId}/site_user_privileges'
      | '/api/admin/users/{parentId}/site_user_privileges'
    >
  "
>
import type {
  GetCollectionPath,
  ResourceParentSiteUserPrivilege,
} from '~~/types'
import { useCreateValidation } from '~/composables/validation/useSiteUserPrivilegeValidation'
import { useNormalization } from '~/composables/normalization/useSiteUserPrivilegeNormalization'

const props = defineProps<{
  path: P
  parent?: ResourceParentSiteUserPrivilege
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
    :path
    post-path="/api/admin/site_user_privileges"
    :redirect-option="false"
    :on-pre-submit
    :get-empty-model
    @refresh="emit('refresh')"
  >
    <template #default>
      <lazy-data-item-form-edit-site-user-privilege
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
