<script setup lang="ts">
import { getSitePrivilegeColor, getSitePrivilegeRole } from '~/utils/acl'

const props = defineProps<{
  privilege: number
  disabled?: boolean
}>()

const key = computed(() => getSitePrivilegeRole(props.privilege))
const color = computed(() => getSitePrivilegeColor(props.privilege))

const active = ref(false)
defineEmits<{
  click: []
}>()
</script>

<template>
  <v-btn
    :color
    icon
    variant="plain"
    data-testid="auth-user-button"
    @click="$emit('click')"
  >
    <v-icon icon="fas fa-user" />
    <v-tooltip activator="parent" location="bottom">{{ key }}</v-tooltip>
  </v-btn>
</template>
