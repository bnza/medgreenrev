<script setup lang="ts">
import DataDialogUserPasswordContentReset from '~/components/data/dialog/DataDialogUserPasswordContentReset.vue'

defineProps<{
  mode: 'reset' | 'change'
}>()

const { isDialogOpen, userData, plainPassword, triggered, submitStatus } =
  storeToRefs(useUserPasswordDialog())
const copyToClipboard = useCopyToClipboard()
</script>

<template>
  <v-dialog
    :model-value="isDialogOpen"
    persistent
    data-testid="data-dialog-user-password"
  >
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
        <v-container v-if="submitStatus === 'pending'" style="height: 350px">
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
        <v-container v-else class="p-0 m-0" style="height: 350px">
          <data-dialog-user-password-content-show
            v-if="plainPassword"
            :plain-password
          />
          <data-dialog-user-password-content-reset
            v-else-if="mode === 'reset' && userData?.id"
            :id="userData.id"
            v-model:triggered="triggered"
            v-model:status="submitStatus"
          />
          <data-dialog-user-password-content-change
            v-else-if="mode === 'change'"
            v-model:triggered="triggered"
            v-model:status="submitStatus"
          />
        </v-container>
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
