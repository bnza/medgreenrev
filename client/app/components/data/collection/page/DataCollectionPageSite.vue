<script setup lang="ts">
const { isAuthenticated } = useAppAuth()
const acl = ref({ canExport: isAuthenticated, canCreate: false })
</script>

<template>
  <data-collection-page
    path="/api/data/archaeological_sites"
    :acl
    :parent="false"
  >
    <template #search-bar>
      <data-collection-search-text-field
        path="/api/data/archaeological_sites"
      />
    </template>
    <data-collection-table-site
      v-model:acl="acl"
      path="/api/data/archaeological_sites"
    />
  </data-collection-page>
</template>
