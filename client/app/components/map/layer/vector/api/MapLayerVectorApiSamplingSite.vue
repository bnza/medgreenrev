<script setup lang="ts">
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'

defineProps<{
  groupKey: FeatureAggregationResourceKey
}>()
</script>

<template>
  <map-layer-vector-api-base
    path="/api/features/sampling_sites"
    :group-key="groupKey"
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
