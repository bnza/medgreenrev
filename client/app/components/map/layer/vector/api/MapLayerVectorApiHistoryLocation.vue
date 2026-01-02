<template>
  <map-layer-vector-api-base
    path="/api/features/history/locations"
    id-prefix="history_locations"
    :label-options="{
      placement: 'point',
      labelProperty: 'value',
      visible: true,
    }"
    :marker-options="{
      fill: { color: 'blue' },
    }"
  >
    <template #popUpContent="{ item }">
      <data-item-info-box-content-history-location :item />
    </template>
  </map-layer-vector-api-base>
</template>
