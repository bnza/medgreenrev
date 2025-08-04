<template>
  <data-dialog-delete
    path="/api/data/context_stratigraphic_units/{id}"
    title="Context/Stratigraphic Unit association"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-context-stratigraphic-unit :item />
    </template>
  </data-dialog-delete>
</template>
