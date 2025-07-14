<script setup lang="ts" generic="Path extends ValidationMethodToPath<'create'>">
import type { PostCollectionRequestMap, ValidationMethodToPath } from '~~/types'
import { useRegle } from '@regle/core'
import rules from '~/utils/validation/rules/user'
import { isValidUserBaseData } from '~/utils/guards'

const props = defineProps<{
  path: Path
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

const { plainPassword, userData } = storeToRefs(useUserPasswordDialog())

const openUserPasswordDialog = ({
  request,
  response,
}: {
  request: Record<string, any>
  response: Record<string, any>
}) => {
  plainPassword.value = request.plainPassword
  if (isValidUserBaseData(response)) {
    console.error('Invalid user data', response)
  }
  userData.value = isValidUserBaseData(response) ? response : undefined
}
</script>

<template>
  <data-dialog-create
    title="User"
    :path
    :regle="r$"
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
