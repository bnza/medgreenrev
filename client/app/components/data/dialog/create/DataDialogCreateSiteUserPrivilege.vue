<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/site_user_privileges'
      | '/api/sites/{parentId}/site_user_privileges'
      | '/api/users/{parentId}/site_user_privileges'
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
  path: Path
  parent?: ResourceParentSiteUserPrivilege
}>()

const { getEmptyModel, r$ } = useCreateValidation(props.parent)

const { onPreCreate: onPreSubmit } = useNormalization()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    title="User"
    :path
    :redirect-option="false"
    :on-pre-submit
    :get-empty-model
  >
    <template #default>
      <data-item-form-edit-site-user-privilege
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
