<script setup lang="ts">
import { API_RESOURCE_MAP, type ApiResourceKey } from '~/utils/consts/resources'

const props = withDefaults(
  defineProps<{
    resourceKey: ApiResourceKey | undefined
    id: string | number
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)
const { push } = useHistoryStackStore()
const { appPath } = props.resourceKey
  ? useResourceConfig(API_RESOURCE_MAP[props.resourceKey])
  : { appPath: '' }

const to = computed(() => `${appPath}/${props.id}`)
const { fullPath } = useRoute()
</script>

<template>
  <v-btn
    density="compact"
    :disabled="disabled || !appPath"
    icon
    variant="text"
    nuxt
    :to
    data-testid="read-item-button"
    @click="push(fullPath)"
  >
    <v-icon color="primary" icon="fas fa-arrow-right" size="xsmall" />
    <v-tooltip activator="parent" location="bottom">View item</v-tooltip>
  </v-btn>
</template>
