<script setup lang="ts">
import type { GetCollectionPath } from '~~/types'
import { ApiRole, ApiSpecialistRole } from '~/utils/consts/auth'
import DataToolbarListItemCreate from '~/components/data/toolbar/DataToolbarListItemCreate.vue'

const path: GetCollectionPath = '/api/data/vocabulary/zoo/taxonomies'

const { isAuthenticated, hasSpecialistRole, hasRole, hasRoleAdmin } =
  useAppAuth()

const canCreate = computed(
  () =>
    hasRoleAdmin.value ||
    (hasRole(ApiRole.Editor).value &&
      hasSpecialistRole(ApiSpecialistRole.ZooArchaeologist).value),
)

const acl = computed(() => ({
  canExport: isAuthenticated.value,
  canCreate: canCreate.value,
}))
</script>
<template>
  <data-collection-page
    :parent="false"
    :path
    :show-back-button="false"
    :acl="acl.canCreate ? acl : false"
  >
    <template v-if="acl.canCreate" #collection-actions>
      <data-toolbar-list-item-create path="/api/vocabulary/zoo/taxonomies" />
    </template>
    <data-collection-table-vocabulary-zoo-taxonomy />
  </data-collection-page>
</template>
