<script setup lang="ts">
import type { GetItemPath, PatchItemPath } from '~~/types'
import { useRegle } from '@regle/core'

const path: GetItemPath & PatchItemPath = '/api/admin/site_user_privileges/{id}'

defineEmits<{
  refresh: []
}>()

const { initialValue, fetchedItem } = useUpdateDialog(path)

const model = ref(structuredClone(initialValue.value))

watch(initialValue, (value) => {
  model.value = structuredClone(value)
})

const { r$ } = useRegle(model, {})
</script>

<template>
  <data-dialog-update
    :initial-value
    :item="model ?? { privilege: 0 }"
    :path
    :regle="r$"
    :fullscreen="false"
    @refresh="$emit('refresh')"
  >
    <template v-if="initialValue" #default>
      <v-card-text class="text-center">
        Are you sure you want to change the privilege of user<br />
        <strong class="text-primary py-2">{{
          fetchedItem?.user?.userIdentifier
        }}</strong
        ><br />
        for the site<br />
        <strong class="text-primary py-2">{{ fetchedItem?.site?.name }}</strong
        ><br />
        to
        <strong>{{ model?.privilege ? 'USER' : 'EDITOR' }}</strong
        >?
      </v-card-text>
    </template>
  </data-dialog-update>
</template>
