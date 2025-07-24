<script setup lang="ts">
import { useRegle } from '@regle/core'
import {
  required,
  sameAs,
  minLength,
  maxLength,
  withMessage,
} from '@regle/rules'
import { UserChangePasswordPostCollectionOperation } from '~/api/operations/resources/user/UserChangePasswordPostCollectionOperation'

const {
  submitStatus: status,
  triggered,
  userData,
} = storeToRefs(useUserPasswordDialog())
const { addError, addSuccess } = useMessagesStore()

// Custom password validation rules to match server-side IsStrongPassword
const hasUppercase = withMessage(
  (value) => typeof value === 'string' && /[A-Z]/.test(value),
  'Password must contain at least one uppercase letter.',
)

const hasLowercase = withMessage(
  (value) => typeof value === 'string' && /[a-z]/.test(value),
  'Password must contain at least one lowercase letter.',
)

const hasDigit = withMessage(
  (value) => typeof value === 'string' && /\d/.test(value),
  'Password must contain at least one digit.',
)

const hasSpecialChar = withMessage(
  (value) => typeof value === 'string' && /[\W_]/.test(value),
  'Password must contain at least one special character.',
)

const model = reactive({
  oldPassword: '',
  plainPassword: '',
  repeatPassword: '',
})

const { r$ } = useRegle(model, {
  oldPassword: {
    required: withMessage(required, 'Old password cannot be blank.'),
  },
  plainPassword: {
    required: withMessage(required, 'Password cannot be blank.'),
    minLength: withMessage(
      minLength(8),
      'Password must be at least 8 characters long.',
    ),
    maxLength: withMessage(
      maxLength(20),
      'Password cannot be longer than 20 characters.',
    ),
    hasUppercase,
    hasLowercase,
    hasDigit,
    hasSpecialChar,
  },
  repeatPassword: {
    required: withMessage(required, 'Repeat password cannot be blank.'),
    sameAs: withMessage(
      sameAs(() => model.plainPassword),
      'Passwords must match.',
    ),
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
