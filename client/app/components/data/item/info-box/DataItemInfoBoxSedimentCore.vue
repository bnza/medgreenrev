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
    path="/api/data/sediment_cores/{id}"
    title="Sample"
    data-testid="data-item-info-box-sediment_cores"
    :app-path="readLink ? '/data/sediment_cores' : undefined"
  >
    <template #activator="props">
      <slot v-bind="{ props }" />
    </template>
    <template #default="{ item }">
      <v-container v-if="item">
        <data-item-info-box-row label="site" :text="item?.site?.name" />
        <data-item-info-box-row label="year" :text="item.year" />
        <data-item-info-box-row label="number" :text="item.number" />
        <data-item-info-box-row label="description" :text="item.description" />
      </v-container>
    </template>
  </data-item-info-box>
</template>
