<script setup lang="ts">
withDefaults(
  defineProps<{
    visible: boolean
    title?: string
    fullscreen?: boolean
  }>(),
  {
    fullscreen: true,
  },
)
defineSlots<{
  default(): any
  actions(): any
  title(): any
}>()

defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()
</script>

<template>
  <v-dialog
    persistent
    :model-value="visible"
    data-testid="data-dialog"
    :close-on-content-click="false"
    :fullscreen
    :max-width="fullscreen ? '100%' : '600px'"
    @update:model-value="$emit('update:visible', $event)"
  >
    <data-card v-if="visible" :title :show-back-button="false">
      <template #title>
        <slot name="title" />
      </template>
      <template #default>
        <slot />
      </template>
      <template #actions>
        <v-container>
          <v-row class="justify-space-around">
            <slot name="actions" />
          </v-row>
        </v-container>
      </template>
    </data-card>
  </v-dialog>
</template>
