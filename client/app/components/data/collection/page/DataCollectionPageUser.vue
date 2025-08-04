<template>
  <data-collection-page
    path="/api/admin/users"
    title="Users"
    :acl="{ canCreate: true, canExport: false }"
  >
    <data-collection-table-user path="/api/admin/users" />
  </data-collection-page>
</template>
