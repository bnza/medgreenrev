<script setup lang="ts">
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'

defineProps<{
  groupKey: FeatureAggregationResourceKey
}>()
</script>

<template>
  <map-layer-vector-api-base
    path="/api/features/history/locations"
    :group-key="groupKey"
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
