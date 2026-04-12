<script setup lang="ts">
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'
defineProps<{
  groupKey: FeatureAggregationResourceKey
}>()
</script>
<template>
  <map-layer-vector-api-base
    path="/api/features/sediment_cores"
    :group-key="groupKey"
    id-prefix="sediment_cores"
    :label-options="{
      placement: 'point',
      labelProperty: 'name',
      visible: true,
    }"
    :marker-options="{
      radius: 5,
      fill: { color: '#2e8b57' },
    }"
  >
    <template #popUpContent="{ item }">
      <data-item-info-box-content-sampling-site :item />
    </template>
  </map-layer-vector-api-base>
</template>
