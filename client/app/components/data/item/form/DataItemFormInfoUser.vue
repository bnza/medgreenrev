<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

const props = defineProps<{
  item: GetItemResponseMap['/api/users/{id}']
}>()

const role = computed(() => reduceAppRoles(props.item.roles))
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="12" xs="6" sm="4" class="px-2">
        <v-text-field :model-value="item.email" label="email" />
      </v-col>
      <v-col data-cy="roles-input-col">
        <v-radio-group :model-value="role">
          <v-radio label="ROLE_ADMIN" color="error" value="ROLE_ADMIN" />
          <v-radio label="ROLE_EDITOR" color="warning" value="ROLE_EDITOR" />
          <v-radio label="ROLE_USER" color="success" value="ROLE_USER" />
        </v-radio-group>
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
