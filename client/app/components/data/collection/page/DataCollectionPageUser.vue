<template>
  <data-collection-page
    path="/api/users"
    title="Users"
    :acl="{ canCreate: true, canExport: false }"
  >
    <data-collection-table-user path="/api/users" />
  </data-collection-page>
</template>
