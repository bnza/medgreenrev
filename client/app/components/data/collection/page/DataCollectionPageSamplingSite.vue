<script setup lang="ts">
const { isAuthenticated } = useAppAuth()
const acl = ref({ canExport: isAuthenticated, canCreate: false })
</script>

<template>
  <data-collection-page path="/api/data/sampling_sites" :acl :parent="false">
    <template #search-bar>
      <data-collection-search-text-field path="/api/data/sampling_sites" />
    </template>
    <data-collection-table-sampling-site
      v-model:acl="acl"
      path="/api/data/sampling_sites"
    />
  </data-collection-page>
</template>
