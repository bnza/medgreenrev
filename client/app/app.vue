<script setup lang="ts">
const {ready} = storeToRefs(useOpenApiStore())
const name = computed(() => (ready.value ? 'default' : 'empty'))
</script>

<template>
  <v-app theme="dark">
    <v-layout data-testid="app-layout">
      <v-main class="d-flex align-center justify-center">
        <NuxtLayout :name>
          <NuxtLoadingIndicator color="warning"/>
          <NuxtPage/>
        </NuxtLayout>
      </v-main>
    </v-layout>
  </v-app>
</template>
