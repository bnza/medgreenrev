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
  (e: 'delete'): void
}>()
</script>

<template>
  <v-btn
    density="compact"
    :disabled
    icon
    variant="text"
    nuxt
    data-testid="delete-item-button"
    @click="$emit('delete')"
  >
    <v-icon color="error" icon="fas fa-minus" size="xsmall"/>
    <v-tooltip activator="parent" location="bottom">Delete item</v-tooltip>
  </v-btn>
</template>
