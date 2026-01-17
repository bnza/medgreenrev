<script setup lang="ts">
import { useScopedRegle } from '@regle/core'
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { required } from '@regle/rules'

type Path = '/api/data/individuals/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const stratigraphicUnitChanged = computed(
  () => props.initialValue.stratigraphicUnit !== model.value.stratigraphicUnit,
)

const identifierChanged = computed(
  () => props.initialValue.identifier !== model.value.identifier,
)

const uniqueSite = useApiUniqueValidator(
  '/api/validator/unique/individuals',
  ['stratigraphicUnit', 'inventory'],
  'Duplicate [site, inventory] combination',
)

const uniqueIdentifier = useApiUniqueValidator(
  '/api/validator/unique/individuals',
  ['identifier', 'stratigraphicUnit'],
  'Duplicate [site, inventory] combination',
)

const { r$ } = useScopedRegle(
  model,
  computed(() => ({
    stratigraphicUnit: {
      required,
      ...(stratigraphicUnitChanged.value
        ? {
            uniqueSite: uniqueSite(() => model.value.identifier),
          }
        : {}),
    },
    identifier: {
      required,
      ...(identifierChanged.value
        ? {
            uniqueIdentifier: uniqueIdentifier(
              () => model.value.stratigraphicUnit,
            ),
          }
        : {}),
    },
  })),
)
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
          disabled
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="r$.$value.identifier"
          label="identifier"
          :error-messages="r$.$errors?.identifier"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <data-selection-individual-sex
          v-model="r$.$value.sex"
          path="/api/vocabulary/pottery/shapes"
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
