<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    identifier?: string
    loading?: boolean
    showBackButton?: boolean
    parent: boolean
  }>(),
  {
    loading: false,
    showBackButton: true,
    parent: false,
  },
)

defineSlots<{
  actions(): any
  append(): any
  default(): any
  'toolbar-append'(): any
}>()
</script>

<template>
  <v-card
    :data-testid="parent ? 'child-data-card' : 'data-card'"
    :loading
    :rounded="false"
    class="w-100 h-100 no-padding"
  >
    <template #item>
      <data-card-toolbar v-bind="$props">
        <template #toolbar-append>
          <slot name="toolbar-append" />
        </template>
      </data-card-toolbar>
      <slot>
        <loading-component />
      </slot>
    </template>
    <template #actions>
      <slot name="actions" />
    </template>
    <template #append>
      <slot name="append" />
    </template>
  </v-card>
</template>

<style scoped>
.no-padding :deep(.v-card-item) {
  padding: 0 !important;
  display: block;
}
</style>
