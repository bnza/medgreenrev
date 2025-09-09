<script setup lang="ts">
const props = defineProps<{
  label: string
  text: unknown
}>()
const shortText = props.text ? String(props.text).substring(0, 200) : undefined
const isLongText = props.text ? String(props.text).length > 200 : false
</script>

<template>
  <v-row v-if="text" dense>
    <v-col cols="4" class="text-secondary text-end text-no-wrap"
      >{{ label }}:</v-col
    >
    <v-col cols="8" class="text-grey-lighten-4 text-justify">
      {{ shortText
      }}<small v-if="isLongText" color="text-gray-darken-3">...</small>
    </v-col>
  </v-row>
</template>
