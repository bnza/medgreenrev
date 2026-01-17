<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { useScopedRegle } from '@regle/core'
import { required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath = '/api/data/individuals'

const props = defineProps<{
  parent?: ResourceParent<'stratigraphicUnit'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const uniqueSite = useApiUniqueValidator(
  '/api/validator/unique/individuals',
  ['stratigraphicUnit', 'identifier'],
  'Duplicate [site, identifier] combination',
)

const uniqueIdentifier = useApiUniqueValidator(
  '/api/validator/unique/individuals',
  ['identifier', 'stratigraphicUnit'],
  'Duplicate [site, identifier] combination',
)

const { r$ } = useScopedRegle(model, {
  stratigraphicUnit: {
    required,
    uniqueSite: uniqueSite(() => model.value.identifier),
  },
  identifier: {
    required,
    uniqueIdentifier: uniqueIdentifier(() => model.value.stratigraphicUnit),
  },
})
</script>

<template>
  <v-card-text class="px-0">
    <v-row>
      <v-col cols="4">
        <data-autocomplete-stratigraphic-unit
          v-model="r$.$value.stratigraphicUnit"
          path="/api/data/stratigraphic_units"
          label="stratigraphic unit"
          item-title="code"
          :error-messages="r$.$errors?.stratigraphicUnit"
          :disabled="props.parent?.key === 'stratigraphicUnit'"
          granted-only
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="r$.$value.identifier"
          label="identifier"
          :error-messages="r$.$errors?.identifier"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <data-selection-individual-sex
          v-model="r$.$value.sex"
          item-title="value"
          label="sex"
        />
      </v-col>
      <v-col cols="12" md="4">
        <data-autocomplete
          v-model="r$.$value.age"
          path="/api/vocabulary/individual/age"
          item-title="value"
          label="age"
          :error-messages="r$.$errors?.age"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea v-model="r$.$value.notes" label="notes" rows="3" />
      </v-col>
    </v-row>
  </v-card-text>
</template>
