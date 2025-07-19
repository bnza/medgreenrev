<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { useRegle } from '@regle/core'
import { required } from '@regle/rules'

const { r$ } = useRegle(
  {} as PatchItemRequestMap['/api/site_user_privileges/{id}'],
  {
    privilege: {
      required,
    },
  },
)

const onPreSubmit = <T extends Record<string, any>>(item: T): Partial<T> => {
  const submitItem = {} as Partial<T>
  // Only privilege can be updated
  if ('privilege' in item) {
    submitItem['privilege' as keyof T] = Number(!item.privilege) as T[keyof T]
  }
  return submitItem
}

const item = computed(
  () =>
    structuredClone(
      toRaw(r$.$value),
    ) as GetItemResponseMap['/api/site_user_privileges/{id}'],
)
</script>

<template>
  <data-dialog-update
    path="/api/site_user_privileges/{id}"
    title="Site/User Privilege"
    v-model:regle="r$"
    :fullscreen="false"
    :on-pre-submit
  >
    <template v-if="item" #default>
      <v-card-text class="text-center">
        Are you sure you want to change the privilege of user<br />
        <strong class="text-primary py-2">{{
          item?.user?.userIdentifier
        }}</strong
        ><br />
        for the site<br />
        <strong class="text-primary py-2">{{ item?.site?.name }}</strong
        ><br />
        to
        <strong>{{ item.privilege ? 'USER' : 'EDITOR' }}</strong
        >?
      </v-card-text>
    </template>
  </data-dialog-update>
</template>
