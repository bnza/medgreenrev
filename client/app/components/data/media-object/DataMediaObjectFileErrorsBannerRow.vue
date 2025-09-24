<script setup lang="ts">
defineProps<{ errors?: string[] }>()
</script>

<template>
  <v-row dense align="center" justify="center">
    <div style="height: 80px" class="d-flex justify-center align-center">
      <v-banner
        v-if="errors && errors.length > 0"
        class="mb-4"
        border
        rounded
        density="compact"
        color="error"
        icon="fas fa-exclamation-triangle"
        :text="errors.join(', ')"
        data-testid="data-dialog-form-file-upload-error"
      />
    </div>
  </v-row>
</template>
