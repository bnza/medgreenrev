<template>
  <v-btn data-testid="data-toolbar-item-user-me-action-menu-button" icon>
    <v-icon>fas fa-ellipsis-vertical</v-icon>
    <v-menu
      activator="parent"
      data-testid="data-toolbar-item-user-me-action-menu"
    >
      <v-list>
        <data-toolbar-list-item-change-password path="/api/users/me" />
      </v-list>
    </v-menu>
  </v-btn>
</template>
