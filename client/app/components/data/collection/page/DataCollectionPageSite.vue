<script setup lang="ts">
import DataDialogCreateSite from '~/components/data/dialog/create/DataDialogCreateSite.vue'
</script>

<template>
  <data-collection-page path="/api/sites" title="Sites">
    <data-collection-table-site />
    <template #dialogs>
      <data-dialog-search-site path="/api/sites" />
      <data-dialog-create-site path="/api/sites" />
      <data-dialog-delete-site path="/api/sites/{id}" />
      <data-dialog-update-site path="/api/sites/{id}" />
    </template>
  </data-collection-page>
</template>
