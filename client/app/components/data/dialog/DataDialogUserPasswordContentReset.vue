<script setup lang="ts">
import { UserResetPasswordPatchItemOperation } from '~/api/operations/resources/user/UserResetPasswordPatchItemOperation'

const props = defineProps<{
  id: string
}>()

const { plainPassword } = storeToRefs(useUserPasswordDialog())
const status = defineModel<'idle' | 'pending' | 'success' | 'error'>('status', {
  required: true,
})
const triggered = defineModel<boolean>('triggered', { required: true })
const { addError } = useMessagesStore()

const resetPasswordOperation = new UserResetPasswordPatchItemOperation()

const submit = () => {
  status.value = 'pending'
  try {
    const requestPlainPassword = generatePassword()
    resetPasswordOperation.request(
      { id: props.id },
      { body: { plainPassword: requestPlainPassword } },
    )
    plainPassword.value = requestPlainPassword
    status.value = 'success'
  } catch (e) {
    addError(e)
    status.value = 'error'
  } finally {
    triggered.value = false
  }
}

watch(triggered, (flag) => {
  if (flag) {
    submit()
  }
})
</script>

<template>
  <v-card-text>
    <v-container>
      <v-row class="mx-4 pt-4" justify="center">
        <v-spacer />
        <v-col cols="12" sm="2">
          <v-icon
            icon="fas fa-triangle-exclamation"
            size="large"
            color="warning"
          />
        </v-col>
        <v-spacer />
      </v-row>
      <v-row class="mx-4 pt-8 text-center">
        Are you sure you want to reset the user's password?<br />
        This action could not be undone.
      </v-row>
    </v-container>
  </v-card-text>
</template>
