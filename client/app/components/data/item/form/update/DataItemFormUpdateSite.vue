<script setup lang="ts">
import { createRule, type Maybe, useScopedRegle } from '@regle/core'
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { decimal, integer, maxValue, minValue, required } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'

type Path = '/api/data/sites/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const apiNameValidator = new GetValidationOperation(
  '/api/validator/unique/sites/name',
)

const uniqueName = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiNameValidator.isValid({ name: value }) : true,
  message: 'Name must be unique',
})

const nameChanged = computed(() => props.initialValue.name !== model.value.name)

const bothPresentOrAbsent = createRule({
  validator: (value: Maybe<number | string>, other: Maybe<number | string>) => {
    const hasValue = value !== null && value !== undefined && value !== ''
    const hasOther = other !== null && other !== undefined && other !== ''
    return hasValue === hasOther
  },
  message: 'Both coordinates must be present or absent',
})

const { r$ } = useScopedRegle(
  model,
  computed(() => ({
    name: {
      // Conditionally add required and unique validation only when name has changed
      // Using spread operator to dynamically build validation rules
      ...(nameChanged.value
        ? {
            required,
            unique: uniqueName,
          }
        : {}),
    },
    chronologyLower: {
      integer,
      minValue: minValue(-32768),
      maxValue: maxValue(new Date().getFullYear()),
      lessThanOrEqual: lessThanOrEqual(
        'Lower chronology must be greater than or equal upper chronology.',
      )(() => model.value.chronologyUpper),
    },
    chronologyUpper: {
      integer,
      minValue: minValue(-32768),
      maxValue: maxValue(new Date().getFullYear()),
      greaterOrEqualThan: greaterThanOrEqual(
        'Upper chronology must be less than or equal lower chronology.',
      )(() => model.value.chronologyLower),
    },
    n: {
      decimal,
      minValue: minValue(-90),
      maxValue: maxValue(90),
      bothPresentOrAbsent: bothPresentOrAbsent(() => model.value.e),
    },
    e: {
      decimal,
      minValue: minValue(-180),
      maxValue: maxValue(180),
      bothPresentOrAbsent: bothPresentOrAbsent(() => model.value.n),
    },
  })),
)
</script>

<template>
  <v-row>
    <v-col cols="4" xs="12" class="px-2">
      <v-text-field
        v-model="r$.$value.code"
        label="code"
        disabled
        :error-messages="r$.$errors.code"
      />
    </v-col>
    <v-col cols="8" xs="12" class="px-2">
      <v-text-field
        v-model="r$.$value.name"
        label="name"
        :error-messages="r$.$errors.name"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4" xs="12" class="px-2">
      <data-selection-list
        v-model="r$.$value.fieldDirector"
        path="/api/list/persons"
        label="field director"
        :error-messages="r$.$errors.fieldDirector"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="5" class="px-2">
      <v-text-field
        v-model.number="r$.$value.chronologyLower"
        label="chronology (lower)"
        :error-messages="r$.$errors.chronologyLower"
      />
    </v-col>
    <v-col cols="12" xs="5" class="px-2">
      <v-text-field
        v-model.number="r$.$value.chronologyUpper"
        label="chronology (upper)"
        :error-messages="r$.$errors.chronologyUpper"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6" xs="12" class="px-2">
      <v-text-field
        v-model.number="r$.$value.n"
        label="coordinate N"
        :error-messages="r$.$errors?.n"
        hint="Decimal Degrees WGS84 (EPSG:4326)"
        persistent-hint
      />
    </v-col>
    <v-col cols="6" xs="12" class="px-2">
      <v-text-field
        v-model.number="r$.$value.e"
        label="coordinate E"
        :error-messages="r$.$errors?.e"
        hint="Decimal Degrees WGS84 (EPSG:4326)"
        persistent-hint
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <data-selection-vocabulary
        v-model="r$.$value.culturalContexts"
        path="/api/vocabulary/cultural_contexts"
        label="cultural contexts"
        multiple
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="r$.$value.description" label="description" />
    </v-col>
  </v-row>
</template>
