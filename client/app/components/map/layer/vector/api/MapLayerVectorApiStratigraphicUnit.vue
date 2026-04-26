<script setup lang="ts">
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'
defineProps<{
  groupKey: FeatureAggregationResourceKey
}>()
</script>
<template>
  <map-layer-vector-api-base
    path="/api/features/stratigraphic_units"
    :group-key="groupKey"
    id-prefix="stratigraphic_units"
    :label-options="{
      placement: 'point',
      labelProperty: 'name',
      visible: true,
    }"
    :marker-options="{
      radius: 5,
      fill: { color: '#60A5FA' },
    }"
  >
    <template #aggregatedPopUpContent="{ item }">
      <data-item-info-box-content-archaeological-site
        v-if="item"
        :item="item as any"
      />
    </template>
  </map-layer-vector-api-base>
</template>
