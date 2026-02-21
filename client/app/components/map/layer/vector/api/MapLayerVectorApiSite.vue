<script setup lang="ts"></script>
<template>
  <map-layer-vector-api-base
    path="/api/features/archaeological_sites"
    id-prefix="archaeological_sites"
    :label-options="{
      placement: 'point',
      labelProperty: 'name',
      visible: true,
    }"
    :marker-options="{
      radius: 5,
      fill: { color: 'red' },
    }"
  >
    <template #popUpContent="{ item }">
      <data-item-info-box-content-site :item />
    </template>
  </map-layer-vector-api-base>
</template>
