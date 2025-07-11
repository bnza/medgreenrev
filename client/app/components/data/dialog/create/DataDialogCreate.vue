<script setup lang="ts" generic="Path extends PostCollectionPath">

import type {PostCollectionPath, PostCollectionRequestMap} from "~~/types";

import useResourceUiStore from "~/stores/resource-ui";
import type {RegleRoot} from "@regle/core";

const props = defineProps<{
  path: Path
  title: string
  regle: RegleRoot
}>()

defineSlots<{
  default(): any
  actions(): any
}>()

const {isCreateDialogOpen: visible} = storeToRefs(useResourceUiStore(props.path))
const {usePostCollection} = useNuxtApp().$queryFactory.getQuery(props.path)
const {addSuccess} = useMessagesStore()

const a = usePostCollection()

const submit = () => {
  props.regle.$validate()
  const isValidItem = (value: any): value is PostCollectionRequestMap[Path] => !props.regle.$invalid

  if (!isValidItem(props.regle.$value)) return

  a.mutation.mutateAsync(props.regle.$value)
  addSuccess('Resource successfully created')

  visible.value = false
}
const disabled = computed(() => false)

watch(visible, (flag) => {
  if (!flag) {
    props.regle.$value = {}
    props.regle.$reset()
  }
})
</script>

<template>
  <data-dialog
    v-if="visible"
    data-testid="data-dialog-create"
    :visible
    :title="`New (${title})`"
  >
    <template #default>
      <v-form data-testid="data-dialog-form">
        <v-sheet class="ma-4">
          <v-container>
            <slot @submit.prevent/>
          </v-container>
        </v-sheet>
      </v-form>
    </template>
    <template #actions>
      <v-col class="d-flex justify-center">
        <v-btn
          data-testid="data-dialog-form-close-button"
          :disabled
          @click="visible=false"
        >close
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-center">
        <v-btn
          color="secondary"
          data-testid="data-dialog-form-submit-button"
          :disabled
          @click="submit"
        >submit
        </v-btn>
      </v-col>
    </template>
  </data-dialog>
</template>
