<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath =
  '/api/admin/site_user_privileges'

const props = defineProps<{
  parent?: ResourceParent<'site'> | ResourceParent<'user'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const uniqueSite = useApiUniqueValidator(
  '/api/validator/unique/site_user_privileges',
  ['site', 'user'],
  'Duplicate [site, user] combination',
)

const uniqueUser = useApiUniqueValidator(
  '/api/validator/unique/site_user_privileges',
  ['user', 'site'],
  'Duplicate [site, user] combination',
)

const { r$ } = useScopedRegle(model, {
  site: {
    required,
    uniqueSite: uniqueSite(() => model.value.user),
  },
  user: {
    required,
    uniqueUser: uniqueUser(() => model.value.site),
  },
})
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="r$.$value.user"
        path="/api/admin/users"
        item-title="email"
        label="user"
        :error-messages="r$.$errors?.user"
        :disabled="parent?.key === 'user'"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6">
      <data-autocomplete-site
        v-model="r$.$value.site"
        path="/api/data/sites"
        item-title="name"
        label="site"
        :error-messages="r$.$errors?.site"
        :disabled="parent?.key === 'site'"
      />
    </v-col>
    <v-col cols="6">
      <v-checkbox
        v-model.number="r$.$value.privilege"
        label="editor"
        :error-messages="r$.$errors?.privilege"
      />
    </v-col>
  </v-row>
</template>
