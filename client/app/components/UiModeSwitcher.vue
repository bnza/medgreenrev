<script setup lang="ts">
const appUiModeStore = useAppUiModeStore()

const { state, icon } = storeToRefs(appUiModeStore)

const { toggle } = appUiModeStore

const text = computed(() => (state.value === 'map' ? 'Map mode' : 'Data mode'))
</script>

<template>
  <v-tooltip :text>
    <template #activator="{ props }">
      <v-btn class="mr-6" :icon v-bind="props" @click="toggle" />
    </template>
  </v-tooltip>
</template>
