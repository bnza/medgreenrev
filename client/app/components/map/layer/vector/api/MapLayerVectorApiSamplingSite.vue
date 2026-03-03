<script setup lang="ts"></script>
<template>
  <map-layer-vector-api-base
    path="/api/features/sampling_sites"
    id-prefix="sampling_sites"
    :label-options="{
      placement: 'point',
      labelProperty: 'name',
      visible: true,
    }"
    :marker-options="{
      radius: 5,
      fill: { color: 'green' },
    }"
  >
    <template #popUpContent="{ item }">
      <data-item-info-box-content-sampling-site :item />
    </template>
  </map-layer-vector-api-base>
</template>
