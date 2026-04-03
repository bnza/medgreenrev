<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath =
  '/api/data/context_stratigraphic_units'

const props = defineProps<{
  parent?: ResourceParent<'context'> | ResourceParent<'stratigraphicUnit'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const uniqueContext = useApiUniqueValidator(
  '/api/validator/unique/context_stratigraphic_units',
  ['context', 'stratigraphicUnit'],
  'Duplicate [context, stratigraphic unit] combination',
)
const uniqueStratigraphicUnit = useApiUniqueValidator(
  '/api/validator/unique/context_stratigraphic_units',
  ['stratigraphicUnit', 'context'],
  'Duplicate [context, stratigraphic unit] combination',
)

const { r$ } = useScopedRegle(model, {
  context: {
    required,
    uniqueContext: uniqueContext(() => model.value.stratigraphicUnit),
  },
  stratigraphicUnit: {
    required,
    uniqueStratigraphicUnit: uniqueStratigraphicUnit(() => model.value.context),
  },
})
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete-stratigraphic-unit
        v-model="r$.$value.stratigraphicUnit"
        path="/api/data/stratigraphic_units"
        item-title="code"
        label="stratigraphic unit"
        :granted-only="parent?.key !== 'stratigraphicUnit'"
        :error-messages="r$.$errors?.stratigraphicUnit"
        :disabled="parent?.key === 'stratigraphicUnit'"
        :query-params="
          parent?.key === 'context' ? { site: parent.item.site?.['@id'] } : {}
        "
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6">
      <data-autocomplete-context
        v-model="r$.$value.context"
        path="/api/data/contexts"
        item-title="name"
        label="context"
        :granted-only="parent?.key !== 'context'"
        :error-messages="r$.$errors?.context"
        :disabled="parent?.key === 'context'"
        :query-params="
          parent?.key === 'stratigraphicUnit'
            ? { site: parent.item.site?.['@id'] }
            : {}
        "
      />
    </v-col>
  </v-row>
</template>
