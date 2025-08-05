<script setup lang="ts">
import { useUpdateValidation } from '~/composables/validation/useSiteUserPrivilegeValidation'
import { useNormalization } from '~/composables/normalization/useSiteUserPrivilegeNormalization'
import type { GetItemResponseMap } from '~~/types'

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/admin/site_user_privileges/{id}'),
)
const { r$, responseItem, item } = useUpdateValidation(updateDialogState)

const { onPreUpdate } = useNormalization()

const isSiteUserPrivilegeFn = (
  item: unknown,
): item is GetItemResponseMap['/api/admin/site_user_privileges/{id}'] =>
  isPlainObject(item) && 'site' in item && 'user' in item && 'privilege' in item
</script>

<template>
  <data-dialog-update
    v-model:regle="r$"
    path="/api/admin/site_user_privileges/{id}"
    title="Site/User Privilege"
    :fullscreen="false"
    :on-pre-submit="onPreUpdate(item)"
  >
    <template v-if="isSiteUserPrivilegeFn(responseItem)" #default>
      <v-card-text class="text-center">
        Are you sure you want to change the privilege of user<br />
        <strong class="text-primary py-2">{{
          responseItem?.user?.userIdentifier
        }}</strong
        ><br />
        for the site<br />
        <strong class="text-primary py-2">{{ responseItem?.site?.name }}</strong
        ><br />
        to
        <strong>{{ responseItem.privilege ? 'USER' : 'EDITOR' }}</strong
        >?
      </v-card-text>
    </template>
  </data-dialog-update>
</template>
