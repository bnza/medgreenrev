<script setup lang="ts">
const { isAuthenticated } = useAppAuth()
const acl = ref({ canExport: isAuthenticated, canCreate: false })
const path = '/api/admin/users'
</script>
<template>
  <data-collection-page :path :parent="false" :acl>
    <template #search-bar>
      <data-collection-search-text-field :path />
    </template>
    <data-collection-table-user v-model:acl="acl" :path />
  </data-collection-page>
</template>
