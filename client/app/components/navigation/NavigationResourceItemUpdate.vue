<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)
defineEmits<{
  (e: 'update'): void
}>()
</script>

<template>
  <v-btn
    density="compact"
    :disabled
    icon
    variant="text"
    nuxt
    data-testid="update-item-button"
    @click="$emit('update')"
  >
    <v-icon color="success" icon="fas fa-pen-to-square" size="xsmall" />
    <v-tooltip activator="parent" location="bottom">Edit item</v-tooltip>
  </v-btn>
</template>
