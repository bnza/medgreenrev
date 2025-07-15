<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

defineProps<{
  item: GetItemResponseMap['/api/site_user_privileges/{id}']
}>()
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="12" xs="6" sm="2" class="px-2">
        <v-text-field :model-value="item.user?.userIdentifier" label="user" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" xs="6" sm="4" class="px-2">
        <v-text-field :model-value="item.site?.code" label="site (code)" />
      </v-col>
      <v-col cols="6" xs="6" sm="4" class="px-2">
        <v-text-field :model-value="item.site?.name" label="site" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="4" class="px-2">
        <v-text-field
          :model-value="getSitePrivilegeRole(item.privilege)"
          label="privilege"
        />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
