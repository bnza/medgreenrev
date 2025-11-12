<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type {
  PatchItemRequestMap,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'

// Merge PATCH and POST shapes as in other edit forms
// Allows reuse in both create and update modes

type Item =
  PatchItemRequestMap[`/api/data/analyses/absolute_dating/botany/charcoals/{id}`] &
    PostCollectionRequestMap[`/api/data/analyses/absolute_dating/botany/charcoals`]

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent: ResourceParent<
    | 'analysisBotanyCharcoal'
    | 'analysisBotanySeed'
    | 'analysisIndividual'
    | 'absDatingAnalysisPottery'
    | 'analysisZooBone'
    | 'analysisZooTooth'
  >
}

defineProps<Props>()
</script>

<template>
  <v-row>
    <v-col cols="6" class="px-2">
      <v-text-field
        v-model.number="item.datingLower"
        label="dating (lower)"
        hint="In years CE"
        persistent-hint
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <v-text-field
        v-model.number="item.datingUpper"
        label="dating (upper)"
        hint="In years CE"
        persistent-hint
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4" class="px-2">
      <v-text-field
        v-model.number="item.uncalibratedDating"
        label="uncalibrated dating"
        hint="In years BP"
        persistent-hint
      />
    </v-col>
    <v-col cols="4" class="px-2">
      <v-text-field
        v-model.number="item.error"
        label="error"
        prefix="±"
        hint="2σ deviation (years)"
        persistent-hint
      />
    </v-col>
    <v-col cols="4" class="px-2">
      <v-text-field v-model="item.calibrationCurve" label="calibration curve" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <v-textarea
        v-model="item.notes"
        label="notes"
        :error-messages="errors?.notes"
      />
    </v-col>
  </v-row>
</template>
