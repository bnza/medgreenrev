import { test } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { AnalysisBotanyCharcoalCollectionPage } from '~~/tests/e2e/pages/analysis-botany-charcoal-collection.page'
import { AnalysisBotanyCharcoalItemPage } from '~~/tests/e2e/pages/analysis-botany-charcoal-item.page'
import { AnalysisBotanySeedCollectionPage } from '~~/tests/e2e/pages/analysis-botany-seed-collection.page'
import { AnalysisBotanySeedItemPage } from '~~/tests/e2e/pages/analysis-botany-seed-item.page'
import { AnalysisIndividualCollectionPage } from '~~/tests/e2e/pages/analysis-individual-collection.page'
import { AnalysisIndividualItemPage } from '~~/tests/e2e/pages/analysis-individual-item.page'
import { AnalysisPotteryCollectionPage } from '~~/tests/e2e/pages/analysis-pottery-collection.page'
import { AnalysisPotteryItemPage } from '~~/tests/e2e/pages/analysis-pottery-item.page'
import { AnalysisSampleCollectionPage } from '~~/tests/e2e/pages/analysis-sample-collection.page'
import { AnalysisSampleItemPage } from '~~/tests/e2e/pages/analysis-sample-item.page'
import { AnalysisSedimentCoreDepthCollectionPage } from '~~/tests/e2e/pages/analysis-sediment-core-depth-collection.page'
import { AnalysisSedimentCoreDepthItemPage } from '~~/tests/e2e/pages/analysis-sediment-core-depth-item.page'
import { AnalysisZooBoneCollectionPage } from '~~/tests/e2e/pages/analysis-zoo-bone-collection.page'
import { AnalysisZooBoneItemPage } from '~~/tests/e2e/pages/analysis-zoo-bone-item.page'
import { AnalysisZooToothCollectionPage } from '~~/tests/e2e/pages/analysis-zoo-tooth-collection.page'
import { AnalysisZooToothItemPage } from '~~/tests/e2e/pages/analysis-zoo-tooth-item.page'
import {
  runBasicLifecycle,
  runAbsoluteDatingLifecycle,
  runDataValidation,
  type SubjectConfig,
} from '~~/tests/e2e/helpers/analysis-subject-lifecycle.helpers'

const botanyCharcoalConfig: SubjectConfig = {
  createCollectionPom: (page) => new AnalysisBotanyCharcoalCollectionPage(page),
  createItemPom: (page) => new AnalysisBotanyCharcoalItemPage(page),
  subjectOption: /TO/,
  analysisOption: /C14/,
  nonDatingAnalysis: /AD/,
  datingAnalysis: /C14/,
  calibrationCurve: 'IntCal20',
  // TODO: fill validation config from fixture data
  validation: {
    duplicateSubjectSearch: '',
    duplicateSubjectOption: /TODO/,
    duplicateAnalysisSearch: '',
    duplicateAnalysisOption: /TODO/,
    fixAnalysisOption: { index: 0, name: /TODO/ },
  },
}

const botanySeedConfig: SubjectConfig = {
  createCollectionPom: (page) => new AnalysisBotanySeedCollectionPage(page),
  createItemPom: (page) => new AnalysisBotanySeedItemPage(page),
  subjectOption: /TO/,
  analysisOption: /C14/,
  nonDatingAnalysis: /AD/,
  datingAnalysis: /C14/,
  calibrationCurve: 'IntCal20',
  // TODO: fill validation config from fixture data
  validation: {
    duplicateSubjectSearch: '',
    duplicateSubjectOption: /TODO/,
    duplicateAnalysisSearch: '',
    duplicateAnalysisOption: /TODO/,
    fixAnalysisOption: { index: 0, name: /TODO/ },
  },
}

const individualConfig: SubjectConfig = {
  createCollectionPom: (page) => new AnalysisIndividualCollectionPage(page),
  createItemPom: (page) => new AnalysisIndividualItemPage(page),
  subjectOption: /TO/,
  analysisOption: /SEM/,
  nonDatingAnalysis: /SEM/,
  datingAnalysis: /C14/,
  calibrationCurve: 'IntCal20',
  // TODO: fill validation config from fixture data
  validation: {
    duplicateSubjectSearch: '',
    duplicateSubjectOption: /TODO/,
    duplicateAnalysisSearch: '',
    duplicateAnalysisOption: /TODO/,
    fixAnalysisOption: { index: 0, name: /TODO/ },
  },
}

const potteryConfig: SubjectConfig = {
  createCollectionPom: (page) => new AnalysisPotteryCollectionPage(page),
  createItemPom: (page) => new AnalysisPotteryItemPage(page),
  subjectOption: /SE/,
  analysisOption: /SEM/,
  nonDatingAnalysis: /ORA/,
  datingAnalysis: /THL/,
  calibrationCurve: 'N/D',
  validation: {
    duplicateSubjectSearch: 'SE.10',
    duplicateSubjectOption: /SE\.10\.2023/,
    duplicateAnalysisSearch: 'ME110',
    duplicateAnalysisOption: /SEM/,
    fixAnalysisOption: { index: 0, name: /XRF/ },
  },
}

const sampleConfig: SubjectConfig = {
  createCollectionPom: (page) => new AnalysisSampleCollectionPage(page),
  createItemPom: (page) => new AnalysisSampleItemPage(page),
  subjectOption: /TO/,
  analysisOption: /OSL/,
  nonDatingAnalysis: /XRF/,
  datingAnalysis: /OSL/,
  calibrationCurve: 'N/D',
  // TODO: fill validation config from fixture data
  validation: {
    duplicateSubjectSearch: '',
    duplicateSubjectOption: /TODO/,
    duplicateAnalysisSearch: '',
    duplicateAnalysisOption: /TODO/,
    fixAnalysisOption: { index: 0, name: /TODO/ },
  },
}

const sedimentCoreDepthConfig: SubjectConfig = {
  createCollectionPom: (page) =>
    new AnalysisSedimentCoreDepthCollectionPage(page),
  createItemPom: (page) => new AnalysisSedimentCoreDepthItemPage(page),
  subjectOption: /SC3/,
  analysisOption: /OSL/,
  nonDatingAnalysis: /XRF/,
  datingAnalysis: /OSL/,
  calibrationCurve: 'N/D',
  // TODO: fill validation config from fixture data
  validation: {
    duplicateSubjectSearch: '',
    duplicateSubjectOption: /TODO/,
    duplicateAnalysisSearch: '',
    duplicateAnalysisOption: /TODO/,
    fixAnalysisOption: { index: 0, name: /TODO/ },
  },
}

const zooBoneConfig: SubjectConfig = {
  createCollectionPom: (page) => new AnalysisZooBoneCollectionPage(page),
  createItemPom: (page) => new AnalysisZooBoneItemPage(page),
  subjectOption: /CA/,
  analysisOption: /ADN/,
  nonDatingAnalysis: /ADN/,
  datingAnalysis: /C14/,
  calibrationCurve: 'IntCal20',
  // TODO: fill validation config from fixture data
  validation: {
    duplicateSubjectSearch: '',
    duplicateSubjectOption: /TODO/,
    duplicateAnalysisSearch: '',
    duplicateAnalysisOption: /TODO/,
    fixAnalysisOption: { index: 0, name: /TODO/ },
  },
}

const zooToothConfig: SubjectConfig = {
  createCollectionPom: (page) => new AnalysisZooToothCollectionPage(page),
  createItemPom: (page) => new AnalysisZooToothItemPage(page),
  subjectOption: /CA/,
  analysisOption: /ADN/,
  nonDatingAnalysis: /ADN/,
  datingAnalysis: /C14/,
  calibrationCurve: 'IntCal20',
  // TODO: fill validation config from fixture data
  validation: {
    duplicateSubjectSearch: '',
    duplicateSubjectOption: /TODO/,
    duplicateAnalysisSearch: '',
    duplicateAnalysisOption: /TODO/,
    fixAnalysisOption: { index: 0, name: /TODO/ },
  },
}

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Analysis subject join', () => {
  test.describe('Botany Charcoal', () => {
    test.describe('Material analyst user', () => {
      test.use({ storageState: 'playwright/.auth/mat.json' })
      test('Basic lifecycle works as expected', async ({ page }) => {
        await runBasicLifecycle(botanyCharcoalConfig, page)
      })
      test('Absolute dating lifecycle works as expected', async ({ page }) => {
        await runAbsoluteDatingLifecycle(botanyCharcoalConfig, page)
      })
      // TODO: enable when validation config is filled
      // test('Data validation', async ({ page }) => {
      //   await runDataValidation(botanyCharcoalConfig, page)
      // })
    })
  })

  test.describe('Botany Seed', () => {
    test.describe('Archaeobotanist user', () => {
      test.use({ storageState: 'playwright/.auth/bot.json' })
      test('Basic lifecycle works as expected', async ({ page }) => {
        await runBasicLifecycle(botanySeedConfig, page)
      })
      test('Absolute dating lifecycle works as expected', async ({ page }) => {
        await runAbsoluteDatingLifecycle(botanySeedConfig, page)
      })
      // TODO: enable when validation config is filled
      // test('Data validation', async ({ page }) => {
      //   await runDataValidation(botanySeedConfig, page)
      // })
    })
  })

  test.describe('Individual', () => {
    test.describe('Anthropologist user', () => {
      test.use({ storageState: 'playwright/.auth/ant.json' })
      test('Basic lifecycle works as expected', async ({ page }) => {
        await runBasicLifecycle(individualConfig, page)
      })
      test('Absolute dating lifecycle works as expected', async ({ page }) => {
        await runAbsoluteDatingLifecycle(individualConfig, page)
      })
      // TODO: enable when validation config is filled
      // test('Data validation', async ({ page }) => {
      //   await runDataValidation(individualConfig, page)
      // })
    })
  })

  test.describe('Pottery', () => {
    test.describe('Ceramic specialist user', () => {
      test.use({ storageState: 'playwright/.auth/pot.json' })
      test('Basic lifecycle works as expected', async ({ page }) => {
        await runBasicLifecycle(potteryConfig, page)
      })
      test('Absolute dating lifecycle works as expected', async ({ page }) => {
        await runAbsoluteDatingLifecycle(potteryConfig, page)
      })
      test('Data validation', async ({ page }) => {
        await runDataValidation(potteryConfig, page)
      })
    })
  })

  test.describe('Sample', () => {
    test.describe('Archaeobotanist user', () => {
      test.use({ storageState: 'playwright/.auth/bot.json' })
      test('Basic lifecycle works as expected', async ({ page }) => {
        await runBasicLifecycle(sampleConfig, page)
      })
      test('Absolute dating lifecycle works as expected', async ({ page }) => {
        await runAbsoluteDatingLifecycle(sampleConfig, page)
      })
      // TODO: enable when validation config is filled
      // test('Data validation', async ({ page }) => {
      //   await runDataValidation(sampleConfig, page)
      // })
    })
  })

  test.describe('Sediment Core Depth', () => {
    test.describe('Geoarchaeologist user', () => {
      test.use({ storageState: 'playwright/.auth/geo.json' })
      test('Basic lifecycle works as expected', async ({ page }) => {
        await runBasicLifecycle(sedimentCoreDepthConfig, page)
      })
      test('Absolute dating lifecycle works as expected', async ({ page }) => {
        await runAbsoluteDatingLifecycle(sedimentCoreDepthConfig, page)
      })
      // TODO: enable when validation config is filled
      // test('Data validation', async ({ page }) => {
      //   await runDataValidation(sedimentCoreDepthConfig, page)
      // })
    })
  })

  test.describe('Zoo Bone', () => {
    test.describe('Zooarchaeologist user', () => {
      test.use({ storageState: 'playwright/.auth/zoo.json' })
      test('Basic lifecycle works as expected', async ({ page }) => {
        await runBasicLifecycle(zooBoneConfig, page)
      })
      test('Absolute dating lifecycle works as expected', async ({ page }) => {
        await runAbsoluteDatingLifecycle(zooBoneConfig, page)
      })
      // TODO: enable when validation config is filled
      // test('Data validation', async ({ page }) => {
      //   await runDataValidation(zooBoneConfig, page)
      // })
    })
  })

  test.describe('Zoo Tooth', () => {
    test.describe('Zooarchaeologist user', () => {
      test.use({ storageState: 'playwright/.auth/zoo.json' })
      test('Basic lifecycle works as expected', async ({ page }) => {
        await runBasicLifecycle(zooToothConfig, page)
      })
      test('Absolute dating lifecycle works as expected', async ({ page }) => {
        await runAbsoluteDatingLifecycle(zooToothConfig, page)
      })
      // TODO: enable when validation config is filled
      // test('Data validation', async ({ page }) => {
      //   await runDataValidation(zooToothConfig, page)
      // })
    })
  })
})
