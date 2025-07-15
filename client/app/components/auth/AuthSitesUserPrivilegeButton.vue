<script setup lang="ts">
import { getSitePrivilegeColor, getSitePrivilegeRole } from '~/utils/acl'

const props = defineProps<{
  privilege: number
}>()

const key = getSitePrivilegeRole(props.privilege)
const color = getSitePrivilegeColor(props.privilege)
</script>

<template>
  <v-btn :color icon variant="plain" data-testid="auth-user-button">
    <v-icon icon="fas fa-user" />
    <v-tooltip activator="parent" location="bottom">{{ key }}</v-tooltip>
  </v-btn>
</template>
