<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath = '/api/data/contexts'

const props = defineProps<{
  parent?: ResourceParent<'site'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const uniqueSite = useApiUniqueValidator(
  '/api/validator/unique/contexts',
  ['site', 'name'],
  'Duplicate [number, site, year] combination',
)
const uniqueName = useApiUniqueValidator(
  '/api/validator/unique/contexts',
  ['name', 'site'],
  'Duplicate [number, site, year] combination',
)

const { r$ } = useScopedRegle(model, {
  type: { required },
  site: { required, uniqueYear: uniqueSite(() => model.value.name) },
  name: { required, uniqueName: uniqueName(() => model.value.site) },
})
</script>

<template>
  <v-card-text class="px-0">
    <v-row>
      <v-col cols="12">
        <data-autocomplete-site
          v-model="r$.$value.site"
          path="/api/data/sites"
          item-title="name"
          label="site"
          granted-only
          :error-messages="r$.$errors?.site"
          :disabled="parent?.key === 'site'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <data-selection-list
          v-model="r$.$value.type"
          path="/api/list/contexts/types"
          label="type"
          :error-messages="r$.$errors?.type"
        />
      </v-col>
      <v-col cols="8">
        <v-text-field
          v-model="r$.$value.name"
          label="name"
          :error-messages="r$.$errors?.name"
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="r$.$value.description"
          label="description"
          rows="3"
        />
      </v-col>
    </v-row>
  </v-card-text>
</template>
