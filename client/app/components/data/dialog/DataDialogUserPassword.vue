<script setup lang="ts">
const props = defineProps<{
  mode: 'reset' | 'change'
}>()

const submitStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const { isDialogOpen, userData, plainPassword } = storeToRefs(
  useUserPasswordDialog(),
)
const copyToClipboard = useCopyToClipboard()
</script>

<template>
  <v-dialog :model-value="isDialogOpen" persistent>
    <v-card width="400px" class="mx-auto">
      <template #title>
        <span
          v-if="userData"
          class="text-secondary"
          data-testid="user-pw-identifier"
          >{{ userData.email }}</span
        >
      </template>
      <template #default>
        <v-container v-if="submitStatus === 'pending'" style="height: 200px">
          <v-row align-content="center" class="fill-height" justify="center">
            <v-col class="text-subtitle-1 text-center" cols="12">
              {{ mode === 'reset' ? 'Resetting' : 'Changing' }} password
            </v-col>
            <v-row align-content="center" class="fill-height" justify="center">
              <v-col cols="12">
                <v-progress-linear
                  color="warning"
                  height="6"
                  indeterminate
                  rounded
                />
              </v-col>
            </v-row>
          </v-row>
        </v-container>
        <data-dialog-user-password-show
          v-else-if="plainPassword"
          :plain-password
        />
        <v-container v-else style="height: 200px" />
      </template>
      <template #actions>
        <layout-action-two-buttons>
          <template #left>
            <v-btn
              text="close"
              :disabled="submitStatus === 'pending'"
              @click="userData = undefined"
            />
          </template>
          <template #default>
            <v-btn
              v-if="plainPassword"
              color="secondary"
              text="copy"
              :disabled="submitStatus === 'pending'"
              @click="copyToClipboard(plainPassword)"
            />
          </template>
        </layout-action-two-buttons>
      </template>
    </v-card>
  </v-dialog>
</template>
