<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/sample_stratigraphic_units'

const props = defineProps<{
  parent?: ResourceParent<'sample'> | ResourceParent<'stratigraphicUnit'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const uniqueStratigraphicUnit = useApiUniqueValidator(
  '/api/validator/unique/sample_stratigraphic_units',
  ['stratigraphicUnit', 'sample'],
  'Duplicate [stratigraphic unit, sample] combination',
)
const uniqueSample = useApiUniqueValidator(
  '/api/validator/unique/sample_stratigraphic_units',
  ['sample', 'stratigraphicUnit'],
  'Duplicate [stratigraphic unit, sample] combination',
)

const { r$ } = useScopedRegle(model, {
  sample: {
    required,
    uniqueSample: uniqueSample(() => model.value.stratigraphicUnit),
  },
  stratigraphicUnit: {
    required,
    uniqueStratigraphicUnit: uniqueStratigraphicUnit(() => model.value.sample),
  },
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <data-autocomplete-sample
          v-model="r$.$value.sample"
          path="/api/data/samples"
          label="sample"
          item-title="code"
          :error-messages="r$.$errors?.sample"
          :disabled="parent?.key === 'sample'"
          :granted-only="true"
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
          :granted-only="true"
          :query-params="
            parent?.key === 'sample' ? { site: parent.item.site?.['@id'] } : {}
          "
        />
      </v-col>
    </v-row>
  </v-container>
</template>
