<script setup lang="ts">
withDefaults(
    defineProps<{
      appPath: string
      id: string | number
      disabled?: boolean
    }>(),
    {
      disabled: false,
    },
)
const {push} = useHistoryStackStore()
const {path} = useRoute()
</script>

<template>
  <v-btn
      density="compact"
      :disabled
      icon
      variant="text"
      nuxt
      :to="`${appPath}/${id}`"
      data-testid="read-item-button"
      @click="push(path)"
  >
    <v-icon color="primary" icon="fas fa-arrow-right" size="xsmall"/>
    <v-tooltip activator="parent" location="bottom">View item</v-tooltip>
  </v-btn>
</template>
