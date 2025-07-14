<script setup lang="ts">
defineProps<{ plainPassword: string }>()
</script>

<template>
  <v-container>
    <v-row class="mx-4 pt-4" justify="center">
      <v-col cols="12" sm="8">
        <div class="text-center">
          <div
            id="plainPassword"
            class="text-secondary border pa-4 font-weight-bold"
          >
            {{ plainPassword }}
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row class="mx-4 pt-8 text-center">
      <v-card-text>
        Copy and save the new password and provide it to the user. You won’t be
        able to see it again!
      </v-card-text>
    </v-row>
  </v-container>
</template>
