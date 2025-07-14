<script setup lang="ts">
type Credential = {
  email: string
  password: string
}

const pending = ref(false)
const email = ref('')
const password = ref('')

const { signIn } = useAuth()
const { addSuccess, addError } = useMessagesStore()

const disabled = computed(() => {
  return !password.value || !email.value || pending.value
})

const historyStack = useHistoryStackStore()

const router = useRouter()

const signInAndFeedback = async ({ email, password }: Credential) => {
  pending.value = true
  try {
    await signIn({ email, password }, { callbackUrl: historyStack.last.path })
    addSuccess(`User ${email} successfully logged in`)
  } catch (e: unknown) {
    console.error(e)
    addError(e)
  } finally {
    pending.value = false
  }
}

onBeforeRouteLeave(() => {
  historyStack.pop()
})
</script>

<template>
  <v-card data-testid="login-data-card" width="400px">
    <v-progress-linear
      color="primary"
      :active="pending"
      :indeterminate="true"
    />
    <v-card-title class="text-secondary">Login</v-card-title>
    <v-card-text>Enter your credentials</v-card-text>
    <v-form class="px-6" @submit.prevent>
      <v-text-field v-model="email" label="e-mail" />
      <v-text-field v-model="password" type="password" label="password" />
    </v-form>
    <v-card-actions>
      <v-btn
        text="cancel"
        :disabled="pending"
        @click="router.replace(historyStack.redirectionPath)"
      />
      <v-spacer />
      <v-btn
        color="secondary"
        text="login"
        :disabled
        @click="signInAndFeedback({ email, password })"
      />
    </v-card-actions>
  </v-card>
</template>
