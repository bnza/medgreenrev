<script setup lang="ts">
const { isAuthenticated } = useAppAuth()
const acl = ref({ canExport: isAuthenticated, canCreate: false })
</script>

<template>
  <data-collection-page path="/api/data/sites" :acl :parent="false">
    <template #search-bar>
      <data-collection-search-text-field path="/api/data/sites" />
    </template>
    <data-collection-table-site v-model:acl="acl" path="/api/data/sites" />
  </data-collection-page>
</template>
