<script setup lang="ts">
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'

defineProps<{
  groupKey: FeatureAggregationResourceKey
}>()
</script>

<template>
  <map-layer-vector-api-base
    path="/api/features/botany/charcoals"
    :group-key="groupKey"
    id-prefix="botany_charcoals"
    :label-options="{
      placement: 'point',
      labelProperty: 'name',
      visible: true,
    }"
    :marker-options="{
      radius: 5,
      fill: { color: '#0A2472' },
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
