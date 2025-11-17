<script
  setup
  lang="ts"
  generic="
    TParent extends Extract<
      ApiResourceKey,
      | 'botanyCharcoal'
      | 'botanySeed'
      | 'context'
      | 'individual'
      | 'pottery'
      | 'zooBone'
      | 'zooTooth'
    >
  "
>
import type { ApiResourceKey } from '~~/types'
import { useScopedRegle } from '@regle/core'
import { integer, maxValue, minValue, required } from '@regle/rules'
import { isEmptyObject } from '~/utils'

type Item = {
  datingLower?: number
  datingUpper?: number
  uncalibratedDating?: number
  error?: number
  calibrationCurve?: string
  notes?: string | null
}

// const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  initialValue: Partial<Item> | null
}

const props = defineProps<Props>()

const model = ref(structuredClone(props.initialValue || {}))

const showForm = ref(Boolean(props.initialValue))

watch(
  () => props.initialValue,
  (newValue) => {
    showForm.value = Boolean(newValue)
  },
)

const { r$ } = useScopedRegle(
  model,
  computed(() =>
    showForm.value
      ? {
          datingLower: {
            required,
            integer,
            minValue: minValue(-32768),
            maxValue: maxValue(new Date().getFullYear()),
            lessThanOrEqual: lessThanOrEqual(
              'Lower dating must be greater than or equal upper dating.',
            )(() => model.value.datingUpper),
          },
          datingUpper: {
            required,
            integer,
            minValue: minValue(-32768),
            maxValue: maxValue(new Date().getFullYear()),
            greaterOrEqualThan: greaterThanOrEqual(
              'Upper dating must be less than or equal lower dating.',
            )(() => model.value.datingLower),
          },
          uncalibratedDating: {
            required,
            integer,
            minValue: minValue(1),
            maxValue: maxValue(32678),
          },
          error: {
            required,
            integer,
            minValue: minValue(1),
            maxValue: maxValue(32678),
          },
          calibrationCurve: {
            required,
          },
        }
      : {},
  ),
)

watch(
  () => showForm.value,
  (flag) => {
    if (flag) {
      model.value = structuredClone(props.initialValue || {})
    } else {
      model.value = {}
    }
    r$.$reset()
  },
  { immediate: true },
)

const isDeleteDialogOpen = ref(false)
const deleteAbsoluteDatingData = async () => {
  showForm.value = false
  isDeleteDialogOpen.value = false
}
</script>

<template>
  <v-dialog v-model="isDeleteDialogOpen" max-width="600px">
    <v-card>
      <v-card-text>
        <p>Would you like to delete absolute dating data</p>
        <br />
        <small class="text-gray-5"
          >The action will be performed on submit</small
        >
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="ml-2"
          text="cancel"
          color="anchor"
          @click="isDeleteDialogOpen = false"
        />
        <v-spacer />
        <v-btn
          class="mr-2"
          text="delete"
          color="error"
          @click="deleteAbsoluteDatingData"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-row justify="end">
    <v-col cols="4">
      <v-checkbox
        v-if="!initialValue || isEmptyObject(r$.$value)"
        v-model="showForm"
        data-testid="show-created-item-abs-data-checkbox"
        label="add absolute dating data"
      />
      <v-btn
        v-else
        text="remove absolute dating data"
        color="secondary"
        @click="isDeleteDialogOpen = true"
      />
    </v-col>
  </v-row>
  <div v-if="showForm">
    <v-row>
      <v-col cols="6" class="px-2">
        <v-text-field
          v-model.number="r$.$value.datingLower"
          label="dating (lower)"
          hint="In years CE"
          persistent-hint
          :error-messages="r$.$errors.datingLower"
        />
      </v-col>
      <v-col cols="6" class="px-2">
        <v-text-field
          v-model.number="r$.$value.datingUpper"
          label="dating (upper)"
          hint="In years CE"
          persistent-hint
          :error-messages="r$.$errors.datingUpper"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="px-2">
        <v-text-field
          v-model.number="r$.$value.uncalibratedDating"
          label="uncalibrated dating"
          hint="In years BP"
          persistent-hint
          :error-messages="r$.$errors.uncalibratedDating"
        />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-text-field
          v-model.number="r$.$value.error"
          label="error"
          prefix="±"
          hint="2σ deviation (years)"
          persistent-hint
          :error-messages="r$.$errors.error"
        />
      </v-col>
      <v-col cols="4" class="px-2">
        <data-selection-list
          v-model="r$.$value.calibrationCurve"
          label="calibration curve"
          path="/api/list/calibration_curves"
          :error-messages="r$.$errors.calibrationCurve"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="px-2">
        <v-textarea v-model="r$.$value.notes" label="notes" />
      </v-col>
    </v-row>
  </div>
</template>
