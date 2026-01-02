<template>
  <map-layer-vector-api-base
    path="/api/features/sites"
    id-prefix="sites"
    :label-options="{
      placement: 'point',
      labelProperty: 'name',
      visible: true,
    }"
  >
    <template #popUpContent="{ item }">
      <data-item-info-box-content-site :item />
    </template>
  </map-layer-vector-api-base>
</template>
