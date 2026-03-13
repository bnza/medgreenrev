<script setup lang="ts">
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'

defineProps<{
  groupKey: FeatureAggregationResourceKey
}>()
</script>

<template>
  <map-layer-vector-api-base
    path="/api/features/history/animals"
    :group-key="groupKey"
    id-prefix="history_animals"
    :label-options="{
      placement: 'point',
      labelProperty: 'name',
      visible: true,
    }"
    :marker-options="{
      radius: 5,
      fill: { color: '#C2410C' },
    }"
  >
    <template #aggregatedPopUpContent="{ item }">
      <data-item-info-box-content-history-location
        v-if="item"
        :item="item as any"
      />
    </template>
  </map-layer-vector-api-base>
</template>
