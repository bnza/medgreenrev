<script setup lang="ts">

import type {BaseAcl} from "~~/types";
import {defaultBaseAcl} from "~/utils/consts/auth";

defineProps<{
  appPath: string
  id: string | number
  acl: BaseAcl
}>()
</script>

<template>
  <v-btn-group variant="text" rounded="lg" class="item-nav">
    <slot name="prepend"/>
    <navigation-resource-item-read
      :id
      :app-path
      :disabled="!acl.canRead"
    />
    <slot name="append"/>
  </v-btn-group>
</template>
