<template>
  <v-row justify="center" data-testid="delete-item-alert-row">
    <v-col cols="12" sm="12" lg="6">
      <v-alert
        class="my-4"
        text="Selected item will be delete. Are you sure you want to proceed? This action cannot be undone."
        title="Delete item?"
        type="error"
        variant="tonal"
      />
    </v-col>
  </v-row>
</template>
