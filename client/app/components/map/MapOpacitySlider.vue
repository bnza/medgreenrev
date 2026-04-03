<script setup lang="ts">
// Parent will pass v-model (float 0..1)
const opacity = defineModel<number>({ required: true })

// helper
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

// UI proxy: integer percent 0..100
const opacityPct = computed<number>({
  get: () => Math.round((opacity.value ?? 0) * 100),
  set: (v) => {
    const n = Number.isFinite(v as number) ? (v as number) : 0
    opacity.value = clamp(n, 0, 100) / 100
  },
})
</script>

<template>
  <v-slider
    v-model="opacityPct"
    :min="0"
    :max="100"
    :step="1"
    class="ma-4"
    label="Opacity"
    hide-details
  >
    <template #append>
      <v-text-field
        v-model.number="opacityPct"
        type="number"
        density="compact"
        style="width: 80px"
        :min="0"
        :max="100"
        :step="1"
        hide-details
      />
    </template>
  </v-slider>
</template>
