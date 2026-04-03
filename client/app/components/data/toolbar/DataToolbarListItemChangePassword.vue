<script setup lang="ts" generic="Path extends keyof paths">
import type { paths } from '~~/types'
import { useAuth } from '#imports'

defineProps<{
  path: Path
}>()

const { userData } = storeToRefs(useUserPasswordDialog())
const { data } = useAuth()
</script>

<template>
  <v-list-item
    data-testid="data-toolbar-menu-change-password-list-item"
    title="change password"
    @click="userData = data || undefined"
  >
    <template #prepend>
      <v-icon color="primary" icon="fas fa-key" />
    </template>
  </v-list-item>
</template>
