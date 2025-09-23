<template>
  <data-collection-page
    path="/api/data/media_objects"
    :acl="{
      canExport: false,
      canCreate: false,
    }"
    :parent="false"
  >
    <data-collection-table-media-object path="/api/data/media_objects" />
  </data-collection-page>
</template>
