import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/analyses/absolute_dating',
  appPath: '/data/analyses/absolute-dating',
  defaultHeaders: [
    {
      key: 'id',
      value: 'id',
      title: 'ID',
      align: 'center',
      width: '100',
      maxWidth: '100',
    },
    {
      key: 'subjectType',
      value: 'subjectType',
      title: 'subject',
      minWidth: '200',
    },
    {
      key: 'analysis.identifier',
      value: 'analysis.identifier',
      title: 'analysis',
      minWidth: '100',
    },
    {
      key: 'analysis.year',
      value: 'analysis.year',
      title: 'year',
      minWidth: '100',
    },
    {
      key: 'analysis.status',
      value: 'analysis.status',
      title: 'status',
      minWidth: '100',
    },
    {
      key: 'analysis.type.value',
      value: 'analysis.type.value',
      title: 'type',
      minWidth: '150',
    },
    {
      key: 'analysis.laboratory',
      value: 'analysis.laboratory',
      title: 'laboratory',
      minWidth: '100',
    },
    {
      key: 'stratigraphicUnit.site.code',
      value: 'stratigraphicUnit.site.code',
      title: 'site',
      minWidth: '100',
    },
    {
      key: 'stratigraphicUnit.code',
      value: 'stratigraphicUnit.code',
      title: 'SU',
      minWidth: '100',
    },
    {
      key: 'analysis.responsible',
      value: 'analysis.responsible',
      title: 'responsible',
      maxWidth: '200',
      minWidth: '200',
    },
    {
      key: 'datingLower',
      value: 'datingLower',
      title: 'dating (lower)',
      minWidth: '100',
    },
    {
      key: 'datingUpper',
      value: 'datingUpper',
      title: 'dating (upper)',
      minWidth: '100',
    },
    {
      key: 'error',
      value: 'error',
      title: 'error (years)',
      minWidth: '100',
    },
    {
      key: 'uncalibratedDating',
      value: 'uncalibratedDating',
      title: 'uncalibrated dating (BP)',
      minWidth: '100',
    },
    {
      key: 'calibrationCurve',
      value: 'calibrationCurve',
      title: 'calibration curve',
      minWidth: '100',
    },
    {
      key: 'notes',
      value: 'notes',
      title: 'notes',
      minWidth: '300',
      sortable: false,
    },
  ],
  labels: ['absolute dating analysis', 'absolute dating analyses'],
  name: 'absDatingAnalysis',
}

export const absDatingAnalysisBotanyCharcoal = {
  ...config,
  apiPath: '/api/data/analyses/absolute_dating/botany/charcoals',
}

export const absDatingAnalysisBotanySeed = {
  ...config,
  apiPath: '/api/data/analyses/absolute_dating/botany/seeds',
}
export const absDatingAnalysisIndividual = {
  ...config,
  apiPath: '/api/data/analyses/absolute_dating/individuals',
}
export const absDatingAnalysisPottery = {
  ...config,
  apiPath: '/api/data/analyses/absolute_dating/potteries',
}
export const absDatingAnalysisZooBone = {
  ...config,
  apiPath: '/api/data/analyses/absolute_dating/zoo/bones',
}
export const absDatingAnalysisZooTooth = {
  ...config,
  apiPath: '/api/data/analyses/absolute_dating/zoo/teeth',
}

export default config
