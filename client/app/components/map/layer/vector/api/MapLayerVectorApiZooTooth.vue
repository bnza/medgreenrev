<script setup lang="ts">
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'

defineProps<{
  groupKey: FeatureAggregationResourceKey
}>()
</script>

<template>
  <map-layer-vector-api-base
    path="/api/features/zoo/teeth"
    :group-key="groupKey"
    id-prefix="zoo_teeth"
    :label-options="{
      placement: 'point',
      labelProperty: 'name',
      visible: true,
    }"
    :marker-options="{
      radius: 5,
      fill: { color: '#DBEAFE' },
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
