<script setup lang="ts" generic="Path extends ValidationMethodToPath<'create'>">
import type { PostCollectionRequestMap, ValidationMethodToPath } from '~~/types'
import { useRegle } from '@regle/core'
import rules from '~/utils/validation/rules/user'

defineProps<{
  path: Path
  parentId?: string
}>()

type RequestBody = PostCollectionRequestMap['/api/users']

const getEmptyModel = () =>
  ({
    roles: [] as string[],
  }) as RequestBody

const { r$ } = useRegle(getEmptyModel(), rules.create)
const onPreSubmit = (item: any) => {
  item.plainPassword = generatePassword()
  return item
}
const { openUserPasswordDialog } = useUserPasswordDialog()
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    title="User"
    :parent-id
    :path
    :on-pre-submit
    :get-empty-model
    @success="(event) => openUserPasswordDialog(event)"
  >
    <template #default>
      <data-item-form-edit-user
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
