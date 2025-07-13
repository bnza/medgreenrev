<script setup lang="ts"></script>

<template>
  <data-item-page path="/api/sites/{id}" title="Site">
    <template #default="{ item }">
      <lazy-data-item-form-info-site :item />
    </template>
  </data-item-page>
</template>
