import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/analysis_subjects',
  appPath: '/data/analyses',
  defaultHeaders: [
    {
      key: 'id',
      value: 'id',
      title: 'ID',
      align: 'center',
      width: '200',
      maxWidth: '200',
    },
    {
      key: 'resourceName',
      value: 'resourceName',
      title: 'subject (type)',
      minWidth: '80',
    },
    {
      key: 'subjectId',
      value: 'subjectId',
      title: 'subject',
      minWidth: '80',
      sortable: false,
    },
  ],
  labels: ['analysis (subject)', 'analysis (subjects)'],
  name: 'analysisSubject',
}

export default config
