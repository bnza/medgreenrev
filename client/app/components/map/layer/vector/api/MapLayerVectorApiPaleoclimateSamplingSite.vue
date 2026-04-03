<script setup lang="ts">
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'

defineProps<{
  groupKey: FeatureAggregationResourceKey
}>()
</script>

<template>
  <map-layer-vector-api-base
    path="/api/features/paleoclimate_sampling_sites"
    :group-key="groupKey"
    id-prefix="paleoclimate_sampling_sites"
    :label-options="{
      placement: 'point',
      labelProperty: 'name',
      visible: true,
    }"
    :marker-options="{
      radius: 5,
      fill: { color: 'purple' },
    }"
  >
    <template #popUpContent="{ item }">
      <data-item-info-box-content-paleoclimate-sampling-site :item />
    </template>
  </map-layer-vector-api-base>
</template>
