<template>
  <data-dialog-delete path="/api/data/sites/{id}" title="Site">
    <template #default="{ item }">
      <lazy-data-item-form-info-site :item />
    </template>
  </data-dialog-delete>
</template>
