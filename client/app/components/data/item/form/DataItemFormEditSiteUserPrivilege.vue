<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import {
  isResourceParentUser,
  isResourceParentSite,
  type ResourceParentSiteUserPrivilege,
} from '~/utils/guards/resourceParent/siteUserPrivileges'

type Item = { site?: string; user?: string; privilege?: number }
const item = defineModel<Item>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  parent?: ResourceParentSiteUserPrivilege
  errors?: RegleErrorTree<Item>
}

const props = defineProps<Props>()
const parentUser = computed(() =>
  isResourceParentUser(props.parent) ? props.parent[2] : undefined,
)
const parentSite = computed(() =>
  isResourceParentSite(props.parent) ? props.parent[2] : undefined,
)

watch(
  () => props.parent,
  (value) => {
    if (isResourceParentUser(value)) {
      item.value.user = value[2]['@id']
    }
  },
)
</script>

<template>
  <v-row>
    <v-text-field
      :disabled="Boolean(parentUser)"
      v-model="item.user"
      label="user"
      :error-messages="errors?.user"
    />
  </v-row>
  <v-row>
    <v-text-field
      :disabled="Boolean(parentSite)"
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
