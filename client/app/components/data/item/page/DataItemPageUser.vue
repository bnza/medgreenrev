<script setup lang="ts"></script>

<template>
  <data-item-page path="/api/users/{id}" title="User">
    <template #default="{ item }">
      <lazy-data-item-form-info-user :item />
    </template>
    <template #dialogs>
      <data-dialog-user-password mode="reset" />
    </template>
  </data-item-page>
</template>
