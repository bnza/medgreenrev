<script setup lang="ts">
const isOpen = defineModel<boolean>()
const { addSuccess } = useMessagesStore()
const { signOut } = useAuth()
const signOutAndFeedBack = async () => {
  await signOut({ callbackUrl: '/' })
  addSuccess('User successfully logged out')
}
</script>

<template>
  <v-dialog
    :model-value="isOpen"
    width="400px"
    :persistent="true"
    data-testid="logout-dialog"
  >
    <v-card>
      <v-card-title class="text-secondary">Logout</v-card-title>
      <v-card-text> Are you sure you want to logout?</v-card-text>
      <v-card-actions>
        <v-btn
          class="ma-4"
          color="anchor"
          variant="tonal"
          text="cancel"
          @click="isOpen = false"
        />
        <v-spacer />
        <v-btn
          class="ma-4"
          color="secondary"
          text="logout"
          @click="signOutAndFeedBack()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
