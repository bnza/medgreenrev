<script setup lang="ts">
import type { GetCollectionPath } from '~~/types'
import { ApiRole, ApiSpecialistRole } from '~/utils/consts/auth'

const path: GetCollectionPath = '/api/data/vocabulary/botany/taxonomies'

const { isAuthenticated, hasSpecialistRole, hasRole, hasRoleAdmin } =
  useAppAuth()

const canCreate = computed(
  () =>
    hasRoleAdmin.value ||
    (hasRole(ApiRole.Editor).value &&
      hasSpecialistRole(ApiSpecialistRole.Archaeobotanist).value),
)

const acl = computed(() => ({
  canExport: isAuthenticated.value,
  canCreate: canCreate.value,
}))
</script>
<template>
  <data-collection-page :parent="false" :path :show-back-button="false" :acl>
    <template #collection-actions>
      <data-toolbar-collection-action-menu
        :acl
        path="/api/vocabulary/botany/taxonomies"
      />
    </template>
    <data-collection-table-vocabulary-botany-taxonomy />
  </data-collection-page>
</template>
