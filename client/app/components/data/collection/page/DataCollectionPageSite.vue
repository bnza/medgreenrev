<script setup lang="ts">
const { siteCollectionAcl: acl } = useAppAuth()
</script>

<template>
  <data-collection-page path="/api/data/sites" :acl :parent="false">
    <data-collection-table-site path="/api/data/sites" />
  </data-collection-page>
</template>
