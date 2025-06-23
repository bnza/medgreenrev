<script setup>
import { mergeProps } from 'vue'

const isLogoutDialogOpen = ref(false)
const { userIdentifier, roleColor } = useAppAuth()
</script>

<template>
  <v-menu>
    <template #activator="{ props: menu }">
      <v-tooltip location="left">
        <template #activator="{ props: tooltip }">
          <v-btn
            :color="roleColor"
            v-bind="mergeProps(menu, tooltip)"
            icon="fas fa-user"
            data-testid="auth-user-button"
          />
        </template>
        <span>{{ userIdentifier }}</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item
        data-testid="user-settings-me-link"
        prepend-icon="fas fa-user-gear"
        :title="userIdentifier"
        nuxt
        to="/settings/me"
      />
      <v-divider />
      <v-list-item
        prepend-icon="fas fa-right-from-bracket"
        title="Logout"
        @click="isLogoutDialogOpen = true"
      />
    </v-list>
  </v-menu>
  <auth-logout-confirmation-dialog v-model="isLogoutDialogOpen" />
</template>
