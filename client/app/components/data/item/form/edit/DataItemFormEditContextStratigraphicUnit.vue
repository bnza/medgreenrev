<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PostCollectionRequestMap, ResourceParent } from '~~/types'

type Item = PostCollectionRequestMap['/api/data/context_stratigraphic_units']
const item = defineModel<Item>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  parent?: ResourceParent<'stratigraphicUnit'> | ResourceParent<'context'>
  errors?: RegleErrorTree<Item>
}

defineProps<Props>()
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete-stratigraphic-unit
        v-model="item.stratigraphicUnit"
        path="/api/data/stratigraphic_units"
        item-title="code"
        label="stratigraphic unit"
        :granted-only="parent?.key !== 'stratigraphicUnit'"
        :error-messages="errors?.stratigraphicUnit"
        :disabled="parent?.key === 'stratigraphicUnit'"
        :query-params="
          parent?.key === 'context' ? { site: parent.item.site?.['@id'] } : {}
        "
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6">
      <data-autocomplete-context
        v-model="item.context"
        path="/api/data/contexts"
        item-title="name"
        label="context"
        :granted-only="parent?.key !== 'context'"
        :error-messages="errors?.context"
        :disabled="parent?.key === 'context'"
        :query-params="
          parent?.key === 'stratigraphicUnit'
            ? { site: parent.item.site?.['@id'] }
            : {}
        "
      />
    </v-col>
  </v-row>
</template>
