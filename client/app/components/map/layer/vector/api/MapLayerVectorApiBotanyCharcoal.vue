<template>
  <map-layer-vector-api-base
    path="/api/features/botany/charcoals"
    id-prefix="botany_charcoals"
    :label-options="{
      placement: 'point',
      labelProperty: 'name',
      visible: true,
    }"
    :marker-options="{
      fill: { color: 'blue' },
    }"
  >
    <!--    <template #popUpContent="{ item }">-->
    <!--      <data-item-info-box-content-history-location :item />-->
    <!--    </template>-->
  </map-layer-vector-api-base>
</template>
