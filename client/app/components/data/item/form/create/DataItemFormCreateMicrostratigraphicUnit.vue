<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { useScopedRegle } from '@regle/core'
import { required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/microstratigraphic_units'

const props = defineProps<{
  parent?: ResourceParent<'stratigraphicUnit'> | ResourceParent<'sample'>
}>()

const model = generateEmptyPostModel(
  path,
  props.parent?.key === 'stratigraphicUnit' ? props.parent : undefined,
)

const uniqueStratigraphicUnit = useApiUniqueValidator(
  '/api/validator/unique/microstratigraphic_units',
  ['stratigraphicUnit', 'identifier'],
  'Duplicate [stratigraphic unit, identifier] combination',
)

const uniqueIdentifier = useApiUniqueValidator(
  '/api/validator/unique/microstratigraphic_units',
  ['identifier', 'stratigraphicUnit'],
  'Duplicate [stratigraphic unit, identifier] combination',
)

const { r$ } = useScopedRegle(model, {
  stratigraphicUnit: {
    required,
    unique: uniqueStratigraphicUnit(() => model.value.identifier),
  },
  identifier: {
    required,
    unique: uniqueIdentifier(() => model.value.stratigraphicUnit),
  },
})
</script>

<template>
  <v-card-text class="px-0">
    <v-row>
      <v-col cols="6">
        <data-autocomplete-stratigraphic-unit
          v-model="r$.$value.stratigraphicUnit"
          path="/api/data/stratigraphic_units"
          label="stratigraphic unit"
          item-title="code"
          :error-messages="r$.$errors?.stratigraphicUnit"
          :disabled="parent?.key === 'stratigraphicUnit'"
          :query-param="
            parent?.key === 'sample'
              ? { 'stratigraphicUnitSamples.sample': parent.item['@id'] }
              : {}
          "
          granted-only
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="r$.$value.identifier"
          label="identifier"
          :error-messages="r$.$errors?.identifier"
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
