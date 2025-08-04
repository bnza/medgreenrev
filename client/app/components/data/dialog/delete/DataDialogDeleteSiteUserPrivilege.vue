<template>
  <data-dialog-delete
    path="/api/admin/site_user_privileges/{id}"
    title="Site/User Privilege"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-site-user-privilege :item />
    </template>
  </data-dialog-delete>
</template>
