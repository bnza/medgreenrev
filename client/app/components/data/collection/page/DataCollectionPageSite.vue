<template>
  <data-collection-page path="/api/sites" title="Sites">
    <data-collection-table-site />
    <template #dialogs>
      <data-dialog-search-site path="/api/sites" />
      <data-dialog-create-site path="/api/sites" />
      <data-dialog-delete-site />
      <data-dialog-update-site />
    </template>
  </data-collection-page>
</template>
