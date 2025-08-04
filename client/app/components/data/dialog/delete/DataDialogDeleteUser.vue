<template>
  <data-dialog-delete path="/api/admin/users/{id}" title="User">
    <template #default="{ item }">
      <lazy-data-item-form-info-user :item />
    </template>
  </data-dialog-delete>
</template>
