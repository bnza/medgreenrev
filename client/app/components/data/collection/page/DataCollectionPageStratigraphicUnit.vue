<script setup lang="ts">
const { stratigraphicUnitCollectionAcl: acl } = useAppAuth()
</script>
<template>
  <data-collection-page
    path="/api/stratigraphic_units"
    title="Stratigraphic Units"
    :acl
  >
    <data-collection-table-stratigraphic-unit path="/api/stratigraphic_units" />
  </data-collection-page>
</template>
