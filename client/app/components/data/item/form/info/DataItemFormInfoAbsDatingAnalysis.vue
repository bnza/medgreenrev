<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetItemPath,
      '/api/data/analyses/absolute_dating/botany/charcoals/{id}'
    >
  "
>
import type { GetItemPath, GetItemResponseMap } from '~~/types'

withDefaults(
  defineProps<{
    item: GetItemResponseMap[P]
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="6" class="px-2">
        <v-text-field
          :model-value="item.datingLower"
          label="dating (lower)"
          hint="In years CE"
          persistent-hint
        />
      </v-col>
      <v-col cols="6" class="px-2">
        <v-text-field
          :model-value="item.datingUpper"
          label="dating (upper)"
          hint="In years CE"
          persistent-hint
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="px-2">
        <v-text-field
          :model-value="item.uncalibratedDating"
          label="uncalibrated dating"
          hint="In years BP"
          persistent-hint
        />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-text-field
          :model-value="item.error"
          label="error"
          prefix="±"
          hint="2σ deviation (years)"
          persistent-hint
        />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-text-field
          :model-value="item.calibrationCurve"
          label="calibration curve"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="px-2">
        <v-textarea :model-value="item.notes" label="notes" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
