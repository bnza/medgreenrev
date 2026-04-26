<script setup lang="ts">
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'
defineProps<{
  groupKey: FeatureAggregationResourceKey
}>()
</script>
<template>
  <map-layer-vector-api-base
    path="/api/features/sampling_stratigraphic_units"
    :group-key="groupKey"
    id-prefix="sampling_stratigraphic_units"
    :label-options="{
      placement: 'point',
      labelProperty: 'name',
      visible: true,
    }"
    :marker-options="{
      radius: 5,
      fill: { color: '#10B981' },
    }"
  >
    <template #popUpContent="{ item }">
      <data-item-info-box-content-sampling-site :item />
    </template>
  </map-layer-vector-api-base>
</template>
