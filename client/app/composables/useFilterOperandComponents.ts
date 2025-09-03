import type { OperandComponentsKey } from '~~/types'
import DataDialogSearchOperandBoolean from '~/components/data/dialog/search/operand/DataDialogSearchOperandBoolean.vue'
import DataDialogSearchOperandNumeric from '~/components/data/dialog/search/operand/DataDialogSearchOperandNumeric.vue'
import DataDialogSearchOperandSingle from '~/components/data/dialog/search/operand/DataDialogSearchOperandSingle.vue'
import DataDialogSearchOperandVocabulary from '~/components/data/dialog/search/operand/DataDialogSearchOperandVocabulary.vue'
import DataDialogSearchOperandNumericRange from '~/components/data/dialog/search/operand/DataDialogSearchOperandNumericRange.vue'
import DataDialogSearchOperandSite from '~/components/data/dialog/search/operand/DataDialogSearchOperandSite.vue'
import DataDialogSearchOperandStratigraphicUnit from '~/components/data/dialog/search/operand/DataDialogSearchOperandStratigraphicUnit.vue'
import DataSelectionZooBoneEndsPreserved from '~/components/data/dialog/search/operand/DataDialogSearchOperandZooBoneEndsPreserved.vue'
import DataSelectionZooBoneSide from '~/components/data/dialog/search/operand/DataDialogSearchOperandZooBoneSide.vue'

const componentNameMap: Record<OperandComponentsKey, Component> = {
  Boolean: DataDialogSearchOperandBoolean,
  Single: DataDialogSearchOperandSingle,
  Numeric: DataDialogSearchOperandNumeric,
  NumericRange: DataDialogSearchOperandNumericRange,
  SelectionZooBoneEndsPreserved: DataSelectionZooBoneEndsPreserved,
  SelectionZooBoneSide: DataSelectionZooBoneSide,
  Vocabulary: DataDialogSearchOperandVocabulary,
  Site: DataDialogSearchOperandSite,
  StratigraphicUnit: DataDialogSearchOperandStratigraphicUnit,
} as const

export function useFilterOperandComponents(
  componentKey: Ref<OperandComponentsKey | undefined>,
) {
  const operandsComponent = computed(() => {
    if (!componentKey.value) {
      return undefined
    }

    return componentNameMap[componentKey.value]
  })

  return {
    operandsComponent,
  }
}
