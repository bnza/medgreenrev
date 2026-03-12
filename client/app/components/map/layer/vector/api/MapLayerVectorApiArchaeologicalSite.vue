<script setup lang="ts">
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'

defineProps<{
  groupKey: FeatureAggregationResourceKey
}>()
</script>

<template>
  <map-layer-vector-api-base
    path="/api/features/archaeological_sites"
    :group-key="groupKey"
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
      <data-item-info-box-content-sampling-site :item />
    </template>
  </map-layer-vector-api-base>
</template>
