<script setup lang="ts">
const { siteCollectionAcl: acl } = useAppAuth()
</script>

<template>
  <data-collection-page path="/api/sites" title="Sites" :acl>
    <data-collection-table-site path="/api/sites" />
  </data-collection-page>
</template>
