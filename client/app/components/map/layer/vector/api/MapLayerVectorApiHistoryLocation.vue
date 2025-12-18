<script setup lang="ts"></script>

<template>
  <map-layer-vector-api-base
    path="/api/features/history/locations"
    :label-options="{
      placement: 'point',
      labelProperty: 'value',
      visible: true,
    }"
  >
    <template #popUpContent="{ item }">
      <data-item-info-box-content-history-location :item />
    </template>
  </map-layer-vector-api-base>
</template>
