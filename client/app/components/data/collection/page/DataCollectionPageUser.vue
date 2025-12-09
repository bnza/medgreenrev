<script setup lang="ts">
const { isAuthenticated } = useAppAuth()
const acl = ref({ canExport: isAuthenticated, canCreate: false })
</script>
<template>
  <data-collection-page path="/api/admin/users" :parent="false" :acl>
    <data-collection-table-user v-model:acl="acl" path="/api/admin/users" />
  </data-collection-page>
</template>
