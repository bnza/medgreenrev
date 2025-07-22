<script setup lang="ts">
import { useRegle } from '@regle/core'
import { required, sameAs } from '@regle/rules'
import { UserChangePasswordPostCollectionOperation } from '~/api/operations/resources/user/UserChangePasswordPostCollectionOperation'

const {
  submitStatus: status,
  triggered,
  userData,
} = storeToRefs(useUserPasswordDialog())
const { addError, addSuccess } = useMessagesStore()

const model = reactive({
  oldPassword: '',
  plainPassword: '',
  repeatPassword: '',
})

const { r$ } = useRegle(model, {
  oldPassword: {
    required,
  },
  plainPassword: {
    required,
  },
  repeatPassword: {
    required,
    sameAs: sameAs(() => model.plainPassword),
  },
})

const changePasswordOperation = new UserChangePasswordPostCollectionOperation()
const submit = async () => {
  await r$.$validate()
  if (r$.$invalid) {
    return
  }
  try {
    status.value = 'pending'
    await changePasswordOperation.request({ body: toRaw(r$.$value) })
    status.value = 'success'
    addSuccess('Password successfully changed')
    userData.value = undefined
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

// Show/hide password management
enum Form {
  OldPassword,
  NewPassword,
  RepeatPassword,
}

const showPassword = reactive([false, false, false])
const fieldTypes = computed(() =>
  showPassword.map((show) => (show ? 'text' : 'password')),
)
const icons = computed(() =>
  showPassword.map((show) => `fas fa-eye${show ? '' : '-slash'}`),
)
const toggleShow = (index: number) => {
  showPassword[index] = !showPassword[index]
}
// Show/hide password management
</script>

<template>
  <v-form>
    <v-container>
      <v-row class="mx-4 pt-4" justify="center">
        <v-col cols="12">
          <v-text-field
            v-model="r$.$value.oldPassword"
            label="old password"
            autocomplete="new-password"
            :error-messages="r$.$errors.oldPassword"
            :type="fieldTypes[Form.OldPassword]"
            :append-inner-icon="icons[Form.OldPassword]"
            @click:append-inner="toggleShow(Form.OldPassword)"
          />
        </v-col>
      </v-row>
      <v-row class="mx-4 pt-4" justify="center">
        <v-col cols="12">
          <v-text-field
            v-model="r$.$value.plainPassword"
            label="new password"
            :error-messages="r$.$errors.plainPassword"
            :type="fieldTypes[Form.NewPassword]"
            :append-inner-icon="icons[Form.NewPassword]"
            @click:append-inner="toggleShow(Form.NewPassword)"
          />
        </v-col>
      </v-row>
      <v-row class="mx-4 pt-4" justify="center">
        <v-col cols="12">
          <v-text-field
            v-model="r$.$value.repeatPassword"
            label="repeat password"
            :error-messages="r$.$errors.repeatPassword"
            :type="fieldTypes[Form.RepeatPassword]"
            :append-inner-icon="icons[Form.RepeatPassword]"
            @click:append-inner="toggleShow(Form.RepeatPassword)"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
