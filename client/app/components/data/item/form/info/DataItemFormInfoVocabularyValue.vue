<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: any
    readLink?: boolean
    label?: string
  }>(),
  {
    readLink: true,
    label: 'value',
  },
)
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="12" class="px-2">
        <v-text-field :model-value :label />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
