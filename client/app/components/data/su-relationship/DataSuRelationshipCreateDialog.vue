<script setup lang="ts">
import { injectStratigraphicUnitsRelationship } from '~/composables/injection/useStratigraphicUnitsRelationship'
import { useRegle } from '@regle/core'
import { required } from '@regle/rules'
import usePostCollectionMutation from '~/composables/queries/usePostCollectionMutation'

const {
  creatingRelationshipText,
  creatingRelationshipType,
  creatingRelationshipIri,
  lftStratigraphicUnit,
  submitStatus,
} = injectStratigraphicUnitsRelationship()

const isDialogOpen = computed({
  get() {
    return Boolean(creatingRelationshipType.value)
  },
  set(_: false) {
    creatingRelationshipType.value = undefined
  },
})

const defaultModel = (): {
  rgtStratigraphicUnit?: string
  relationship?: string
  lftStratigraphicUnit: string
} => ({
  lftStratigraphicUnit: lftStratigraphicUnit.value['@id'],
})

const { r$ } = useRegle(defaultModel(), {
  rgtStratigraphicUnit: {
    required,
  },
  relationship: {
    required,
  },
  lftStratigraphicUnit: {
    required,
  },
})

const { postCollection, invalidatedCacheEntries } = usePostCollectionMutation(
  '/api/data/stratigraphic_unit_relationships',
)

const { addError, addSuccess } = useMessagesStore()

const emit = defineEmits<{
  refresh: []
}>()
const submit = async () => {
  r$.$value.relationship = creatingRelationshipIri.value

  r$.$reset()
  await nextTick()
  const { valid, data: model } = await r$.$validate()
  if (!valid) {
    console.error('validation failed. Skipping', model)
    return
  }
  submitStatus.value = 'pending'

  try {
    await postCollection.mutateAsync({ model })

    // If no cache hits, probably query cache has been deleted
    // so we need to force a refresh of the collection
    if (!invalidatedCacheEntries.value.length) {
      emit('refresh')
    }

    submitStatus.value = 'success'
    addSuccess('new relationship successfully created')
    creatingRelationshipType.value = undefined
  } catch (e) {
    submitStatus.value = 'error'
    addError(e)
  }
}

const reset = () => {
  r$.$reset()
  r$.$value = defaultModel()
  submitStatus.value = 'idle'
}
</script>

<template>
  <v-dialog
    persistent
    :model-value="isDialogOpen"
    max-width="400px"
    @after-leave="reset()"
  >
    <v-card title="new relationship" data-testid="add-su-relationship-card">
      <v-card-text>
        <v-form>
          <v-container>
            <v-row dense justify="center">
              <v-col
                justify="center"
                class="text-center text-secondary font-weight-bold"
              >
                <p>{{ lftStratigraphicUnit.code }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col justify="center" class="text-uppercase text-center">
                <p>{{ creatingRelationshipText }}</p>
              </v-col>
            </v-row>
          </v-container>
          <v-row>
            <v-col justify="center">
              <data-autocomplete-stratigraphic-unit
                v-model="r$.$value.rgtStratigraphicUnit"
                granted-only
                path="/api/data/stratigraphic_units"
                label="stratigraphic unit"
                item-title="code"
                :error-messages="r$.$errors.rgtStratigraphicUnit"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="anchor" @click="isDialogOpen = false">cancel</v-btn>
        <v-spacer />
        <v-btn color="primary" @click="submit()">submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
