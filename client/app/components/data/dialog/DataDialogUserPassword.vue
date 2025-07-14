<script setup lang="ts">
import DataDialogUserPasswordContentReset from '~/components/data/dialog/DataDialogUserPasswordContentReset.vue'

defineProps<{
  mode: 'reset' | 'change'
}>()

const submitStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
const { isDialogOpen, userData, plainPassword } = storeToRefs(
  useUserPasswordDialog(),
)
const copyToClipboard = useCopyToClipboard()

const triggered = ref(false)
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
              <v-card-text>
                {{ mode === 'reset' ? 'Resetting' : 'Changing' }} password
              </v-card-text>
            </v-col>
            <v-col cols="6">
              <v-progress-linear
                color="warning"
                height="6"
                indeterminate
                rounded
              />
            </v-col>
          </v-row>
        </v-container>
        <data-dialog-user-password-content-show
          v-else-if="plainPassword"
          :plain-password
        />
        <data-dialog-user-password-content-reset
          v-else-if="mode === 'reset' && userData?.id"
          :id="userData.id"
          v-model:triggered="triggered"
          v-model:status="submitStatus"
        />
        <v-container v-else style="height: 200px" />
      </template>
      <template #actions>
        <layout-action-two-buttons>
          <template #left>
            <v-btn
              color="anchor"
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
            <v-btn
              v-else
              :text="mode"
              :disabled="submitStatus === 'pending'"
              @click="triggered = true"
            />
          </template>
        </layout-action-two-buttons>
      </template>
    </v-card>
  </v-dialog>
</template>
