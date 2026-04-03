<script setup lang="ts">
withDefaults(
  defineProps<{
    item: { value: string }
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="12" class="px-2">
        <v-text-field :model-value="item.value" label="value" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
