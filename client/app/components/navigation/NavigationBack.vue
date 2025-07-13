<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
    tooltipText?: string
  }>(),
  {
    disabled: false,
    tooltipText: 'Back',
  },
)
const clicked = ref(false)
const historyStackStore = useHistoryStackStore()

const { last: to } = storeToRefs(historyStackStore)

onUnmounted(() => {
  if (clicked.value && to.value.isUserAction) {
    historyStackStore.pop()
  }
})
</script>

<template>
  <v-tooltip location="bottom" :text="tooltipText">
    <template #activator="{ props: actProps }">
      <v-btn
        :to="to.path"
        :disabled
        data-testid="navigation-back-button"
        class="ma-0 pa-0"
        icon
        @click="clicked = true"
      >
        <v-icon class="mx-3" v-bind="actProps" icon="fas fa-arrow-left" />
      </v-btn>
    </template>
  </v-tooltip>
</template>
