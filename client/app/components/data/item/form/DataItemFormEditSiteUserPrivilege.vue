<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { ResourceParentSiteUserPrivilege } from '~~/types'

type Item = { site?: string; user?: string; privilege?: number }
const item = defineModel<Item>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  parent?: ResourceParentSiteUserPrivilege
  errors?: RegleErrorTree<Item>
}

defineProps<Props>()
</script>

<template>
  <v-row>
    <v-text-field
      :disabled="parent?.key === 'user'"
      v-model="item.user"
      label="user"
      :error-messages="errors?.user"
    />
  </v-row>
  <v-row>
    <v-text-field
      :disabled="parent?.key === 'site'"
      v-model="item.site"
      label="site"
      :error-messages="errors?.site"
    />
    <v-row>
      <v-checkbox
        v-model="item.privilege"
        label="editor"
        :error-messages="errors?.privilege"
      />
    </v-row>
  </v-row>
</template>
