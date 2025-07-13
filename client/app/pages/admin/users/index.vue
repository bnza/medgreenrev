<script setup lang="ts">
import { AclVoters } from '~/utils/consts/auth'

definePageMeta({
  voters: [AclVoters.HasRoleAdmin],
})
</script>

<template>
  <data-card title="Sites">
    <lazy-data-collection-table-user />
  </data-card>
</template>
