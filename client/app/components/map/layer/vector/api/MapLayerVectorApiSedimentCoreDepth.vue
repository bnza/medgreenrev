<script setup lang="ts">
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'
defineProps<{
  groupKey: FeatureAggregationResourceKey
}>()
</script>
<template>
  <map-layer-vector-api-base
    path="/api/features/sediment_core_depths"
    :group-key="groupKey"
    id-prefix="sediment_core_depths"
    :label-options="{
      placement: 'point',
      labelProperty: 'name',
      visible: true,
    }"
    :marker-options="{
      radius: 5,
      fill: { color: '#355e3b' },
    }"
  >
    <template #popUpContent="{ item }">
      <data-item-info-box-content-sampling-site :item />
    </template>
  </map-layer-vector-api-base>
</template>
