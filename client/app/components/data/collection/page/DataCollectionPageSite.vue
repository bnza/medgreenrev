<script setup lang="ts">
const { siteCollectionAcl: acl } = useAppAuth()
</script>

<template>
  <data-collection-page path="/api/data/sites" :acl :parent="false">
    <template #search-bar>
      <data-collection-search-text-field path="/api/data/sites" />
    </template>
    <data-collection-table-site path="/api/data/sites" />
  </data-collection-page>
</template>
