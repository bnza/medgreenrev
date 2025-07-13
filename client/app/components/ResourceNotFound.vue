<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    error: unknown
    path: string
    tooltipText?: string
  }>(),
  {
    tooltipText: 'Back to collection',
  },
)
const message = ref('')
if (props.error) {
  if (!isObject(props.error)) {
    message.value = String(props.error)
  }

  if (isObject(props.error) && 'message' in props.error) {
    message.value = String(props.error.message)
  }
}
</script>

<template>
  <v-empty-state
    v-if="message"
    title="Requested resource cannot be found"
    :text="message"
    data-testid="resource-empty-state"
  >
    <template #actions>
      <lazy-navigation-back />
    </template>
  </v-empty-state>
</template>
