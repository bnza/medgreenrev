<script setup lang="ts">
withDefaults(
  defineProps<{
    iri: string
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)
</script>
<template>
  <data-item-info-box
    v-if="isValidIri(iri)"
    :iri
    path="/api/data/sediment_core_depths/{id}"
    :read-link
    data-testid="data-item-info-box-sediment_core_depths"
  >
    <template #activator="props">
      <slot v-bind="{ props }" />
    </template>
    <template #default="{ item }">
      <v-container v-if="item">
        <data-item-info-box-row
          label="sediment core"
          :text="item?.sedimentCore?.code"
        />
        <data-item-info-box-row
          label="stratigraphic unit"
          :text="item?.stratigraphicUnit?.code"
        />
        <data-item-info-box-row label="depth min" :text="item.depthMin" />
        <data-item-info-box-row label="depth max" :text="item.depthMax" />
        <data-item-info-box-row label="notes" :text="item.notes" />
      </v-container>
    </template>
  </data-item-info-box>
</template>
