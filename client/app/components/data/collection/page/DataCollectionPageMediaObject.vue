<script setup lang="ts">
const { isAuthenticated } = useAppAuth()
const acl = ref({ canExport: isAuthenticated, canCreate: false })
</script>

<template>
  <data-collection-page path="/api/data/media_objects" :acl :parent="false">
    <data-collection-table-media-object
      v-model:acl="acl"
      path="/api/data/media_objects"
    />
  </data-collection-page>
</template>
