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
    <v-col cols="6">
      <data-autocomplete
        path="/api/users"
        item-title="email"
        v-model="item.user"
        label="user"
        :disabled="parent?.key === 'user'"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        path="/api/sites"
        item-title="name"
        v-model="item.site"
        label="site"
        :disabled="parent?.key === 'site'"
      />
    </v-col>
    <v-col cols="6">
      <v-checkbox
        v-model="item.privilege"
        label="editor"
        :error-messages="errors?.privilege"
      />
    </v-col>
  </v-row>
</template>
