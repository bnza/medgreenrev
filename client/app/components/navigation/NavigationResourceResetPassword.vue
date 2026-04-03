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
  (e: 'reset-password'): void
}>()
</script>

<template>
  <v-btn
    density="compact"
    :disabled
    icon
    variant="text"
    nuxt
    data-testid="reset-password-button"
    @click="$emit('reset-password')"
  >
    <v-icon color="primary" icon="fas fa-arrows-spin" size="xsmall" />
    <v-tooltip activator="parent" location="bottom">Reset password</v-tooltip>
  </v-btn>
</template>
