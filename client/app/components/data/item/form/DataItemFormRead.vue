<template>
  <v-form class="mx-4" readonly data-testid="data-item-form" @submit.prevent>
    <v-container fluid>
      <slot />
    </v-container>
  </v-form>
</template>
