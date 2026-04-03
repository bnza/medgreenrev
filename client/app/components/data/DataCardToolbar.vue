<script setup lang="ts">
withDefaults(
  defineProps<{
    identifier?: string
    title?: string
    showBackButton?: boolean
  }>(),
  {
    showBackButton: true,
  },
)

defineSlots<{
  'toolbar-prepend'(): any
  'title-append'(): any
  'toolbar-append'(): any
  title(): any
}>()
</script>

<template>
  <v-toolbar data-testid="data-card-toolbar" density="compact">
    <template #prepend>
      <lazy-navigation-back v-if="showBackButton" />
      <slot name="toolbar-prepend" />
    </template>
    <template #title>
      <slot name="title">
        <span
          v-if="title"
          data-testid="data-card-toolbar-main-title"
          class="text-uppercase text-grey-lighten-1"
          >{{ title }}</span
        >
      </slot>
      <span
        v-if="identifier"
        class="font-weight-bold text-secondary pl-6"
        data-testid="data-card-toolbar-identifier"
      >
        {{ identifier }}
      </span>
      <slot name="title-append" />
    </template>
    <template #append>
      <slot name="toolbar-append" />
    </template>
  </v-toolbar>
</template>
