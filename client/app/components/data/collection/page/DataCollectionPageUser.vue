<template>
  <data-collection-page path="/api/users" title="Users">
    <data-collection-table-user />
    <template #dialogs>
      <data-dialog-search-user path="/api/users" />
      <data-dialog-create-user path="/api/users" />
      <data-dialog-delete-user />
      <data-dialog-update-user />
    </template>
  </data-collection-page>
</template>
