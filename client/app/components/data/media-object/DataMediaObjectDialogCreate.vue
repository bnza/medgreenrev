<script setup lang="ts">
const visible = defineModel<boolean>({ required: true })
</script>

<template>
  <data-dialog :visible title="Add media object association">
    <template #default>
      <v-form data-testid="data-dialog-form" class="ma-4">
        <v-container fluid>
          <v-row dense>
            <v-col cols="12">
              <v-file-upload v-model="file" clearable>
                <template #item="{ file: itemFile, props: itemProps }">
                  <data-media-object-uploading-file
                    v-bind="{
                      file: itemFile,
                      onClickRemove: itemProps['onClick:remove'],
                    }"
                    :errors="r$.$errors.mediaObject"
                    @found="r$.$value.mediaObject = $event"
                  />
                </template>
              </v-file-upload>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </template>
  </data-dialog>
</template>

<style scoped></style>
