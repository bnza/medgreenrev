<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { required, numeric } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/sediment_core_depths'

const props = defineProps<{
  parent?: ResourceParent<'sedimentCore'> | ResourceParent<'stratigraphicUnit'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const uniqueSedimentCore = useApiUniqueValidator(
  '/api/validator/unique/sediment_core_depths',
  ['sedimentCore', 'depthMin'],
  'Duplicate [sediment core, depth (min)] combination',
)
const uniqueDepthMin = useApiUniqueValidator(
  '/api/validator/unique/sediment_core_depths',
  ['depthMin', 'sedimentCore'],
  'Duplicate [sediment core, depth (min)] combination',
)

const { r$ } = useScopedRegle(model, {
  sedimentCore: {
    required,
    unique: uniqueSedimentCore(() => model.value.depthMin),
  },
  stratigraphicUnit: {
    required,
  },
  depthMin: {
    required,
    numeric,
    greaterThan: greaterThan('Min depth must be positive.')(0),
    lessThan: lessThan('Min depth must be less than max depth.')(() =>
      Number(model.value.depthMax),
    ),
    unique: uniqueDepthMin(() => model.value.sedimentCore),
  },
  depthMax: {
    required,
    numeric,
    greaterThan: greaterThan('Max depth must be greater than min depth.')(() =>
      Number(model.value.depthMin),
    ),
  },
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <data-autocomplete
          v-model="r$.$value.sedimentCore"
          path="/api/data/sediment_cores"
          label="sediment core"
          item-title="code"
          :error-messages="r$.$errors?.sedimentCore"
          :disabled="parent?.key === 'sedimentCore'"
          granted-only
          :query-params="
            parent?.key === 'stratigraphicUnit'
              ? { site: parent.item.site?.['@id'] }
              : {}
          "
        />
      </v-col>
      <v-col cols="12" md="6">
        <data-autocomplete-stratigraphic-unit
          v-model="r$.$value.stratigraphicUnit"
          path="/api/data/stratigraphic_units"
          label="stratigraphic unit"
          item-title="code"
          :error-messages="r$.$errors?.stratigraphicUnit"
          :disabled="parent?.key === 'stratigraphicUnit'"
          granted-only
          :query-params="
            parent?.key === 'sedimentCore'
              ? { site: parent.item.site?.['@id'] }
              : {}
          "
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="r$.$value.depthMin"
          :error-messages="r$.$errors?.depthMin"
          label="depth (min)"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="r$.$value.depthMax"
          :error-messages="r$.$errors?.depthMax"
          label="depth (max)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea v-model="r$.$value.notes" label="notes" rows="3" />
      </v-col>
    </v-row>
  </v-container>
</template>
