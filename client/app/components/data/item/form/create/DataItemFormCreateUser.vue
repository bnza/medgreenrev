<script setup lang="ts">
import type { ApiResourcePath, PostCollectionPath } from '~~/types'
import { useScopedRegle } from '@regle/core'
import { email, minLength, required } from '@regle/rules'
import { ApiRole, ApiSpecialistRole } from '~/utils/consts/auth'
import { mergeRole } from '~/utils/acl'

const path: ApiResourcePath | PostCollectionPath = '/api/admin/users'

const model = generateEmptyPostModel(path)
const { r$ } = useScopedRegle(
  model,
  computed(() => ({
    email: { required, email },
    roles: { required, minLength: minLength(1) },
  })),
)

const role = computed({
  get() {
    return r$.$value.roles ? reduceAppRoles(r$.$value.roles) : ApiRole.User
  },
  set(value: ApiRole) {
    r$.$value.roles = mergeRole(
      value,
      r$.$value.roles as (ApiRole | ApiSpecialistRole)[],
    )
  },
})
</script>

<template>
  <v-row>
    <v-col cols="8">
      <v-text-field
        v-model="r$.$value.email"
        label="email"
        :error-messages="r$.$errors?.email"
      />
    </v-col>
    <v-col cols="4">
      <v-checkbox
        v-model="r$.$value.enabled"
        label="enabled"
        color="secondary"
        density="compact"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col data-cy="roles-input-col" cols="4">
      <v-radio-group
        v-model="role"
        :error-messages="flattenRegleErrors(r$.$errors?.roles)"
      >
        <v-radio label="administrator" color="error" :value="ApiRole.Admin" />
        <v-radio label="editor" color="warning" :value="ApiRole.Editor" />
        <v-radio label="user" color="success" :value="ApiRole.User" />
      </v-radio-group>
    </v-col>
    <v-col cols="4">
      <v-checkbox
        v-model="r$.$value.roles"
        label="anthropologist"
        color="primary"
        :value="ApiSpecialistRole.Anthropologist"
        density="compact"
      />
      <v-checkbox
        v-model="r$.$value.roles"
        label="archaeobotanist"
        color="primary"
        :value="ApiSpecialistRole.Archaeobotanist"
        density="compact"
      />
      <v-checkbox
        v-model="r$.$value.roles"
        label="ceramic specialist"
        color="primary"
        :value="ApiSpecialistRole.CeramicSpecialist"
        density="compact"
      />
      <v-checkbox
        v-model="r$.$value.roles"
        label="geo archeologist"
        color="primary"
        :value="ApiSpecialistRole.GeoArchaeologist"
        density="compact"
      />
    </v-col>
    <v-col cols="4">
      <v-checkbox
        v-model="r$.$value.roles"
        label="historian"
        color="primary"
        :value="ApiSpecialistRole.Historian"
        density="compact"
      />
      <v-checkbox
        v-model="r$.$value.roles"
        label="material analyst"
        color="primary"
        :value="ApiSpecialistRole.MaterialAnalyst"
        density="compact"
      />
      <v-checkbox
        v-model="r$.$value.roles"
        label="paleoclimatologist"
        color="primary"
        :value="ApiSpecialistRole.PaleoClimatologist"
        density="compact"
      />
      <v-checkbox
        v-model="r$.$value.roles"
        label="zoo archaeologist"
        color="primary"
        :value="ApiSpecialistRole.ZooArchaeologist"
        density="compact"
      />
    </v-col>
  </v-row>
</template>

<style scoped>
.v-checkbox ::v-deep(label) {
  padding-left: 1rem;
}
</style>
