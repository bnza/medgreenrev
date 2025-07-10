<script setup lang="ts" generic="Path extends ApiPath">

import type {ApiPath} from "~~/types";
import useResourceUiStore from "~/stores/resource-ui";

const props = defineProps<{
  path: Path
  title: string
}>()

defineSlots<{
  default(): any
  actions(): any
}>()

const {isSearchDialogOpen: visible} = storeToRefs(useResourceUiStore(props.path))
</script>

<template>
  <data-dialog
    data-testid="data-dialog-search"
    :visible
    :title="`Search (${title})`"
  >
    <template #default>
      <slot/>
    </template>
    <template #actions>
      <v-btn
        data-testid="data-dialog-form-close-button"
        @click="visible=false"
      >close
      </v-btn>
    </template>
  </data-dialog>
</template>
