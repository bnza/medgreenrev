<template>
  <data-collection-page
    path="/api/data/media_objects"
    title="Media"
    :acl="{
      canExport: false,
      canCreate: false,
    }"
    :parent="false"
  >
    <data-collection-table-media-object path="/api/data/media_objects" />
  </data-collection-page>
</template>
