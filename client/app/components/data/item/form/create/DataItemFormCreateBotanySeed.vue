<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath = '/api/data/botany/seeds'

const props = defineProps<{
  parent?: ResourceParent<'stratigraphicUnit'> | ResourceParent<'analysis'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const { r$ } = useScopedRegle(model, {
  stratigraphicUnit: { required },
  element: { required },
  taxonomy: { required },
  // part: { required },
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <data-autocomplete-stratigraphic-unit
          v-model="r$.$value.stratigraphicUnit"
          path="/api/data/stratigraphic_units"
          label="stratigraphic unit"
          item-title="code"
          :error-messages="r$.$errors?.stratigraphicUnit"
          :disabled="parent?.key === 'stratigraphicUnit'"
          :granted-only="true"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1" class="px-2">
        <v-checkbox v-model="r$.$value.type" label="type" />
      </v-col>
      <v-col cols="1" class="px-2">
        <v-checkbox v-model="r$.$value.cf" label="cf" />
      </v-col>
      <v-col cols="6">
        <data-autocomplete-vocabulary-botany-taxonomy
          v-model="r$.$value.taxonomy"
          :error-messages="r$.$errors?.taxonomy"
        />
      </v-col>
      <v-col cols="1" class="px-2">
        <v-checkbox v-model="r$.$value.sp" label="sp" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3">
        <data-autocomplete
          v-model="r$.$value.element"
          path="/api/vocabulary/botany/elements"
          item-title="value"
          label="element"
          :error-messages="r$.$errors?.element"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <data-autocomplete
          v-model="r$.$value.part"
          path="/api/vocabulary/botany/element_parts"
          item-title="value"
          label="part"
          :error-messages="r$.$errors?.part"
          clearable
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
