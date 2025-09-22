import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/analyses/zoo/teeth',
  appPath: '/data/analysis/zoo/teeth',
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
      key: 'item.code',
      value: 'item.code',
      title: 'element',
      minWidth: '100',
      sortable: false,
    },
    {
      key: 'analysis.type.group',
      value: 'analysis.type.group',
      title: 'group',
      maxWidth: '200',
      minWidth: '200',
    },
    {
      key: 'analysis.type',
      value: 'analysis.type.value',
      title: 'type',
      maxWidth: '200',
      minWidth: '200',
    },
    {
      key: 'analysis.identifier',
      value: 'analysis.identifier',
      title: 'analysis',
      maxWidth: '200',
      minWidth: '200',
    },
    {
      key: 'summary',
      value: 'summary',
      title: 'summary',
      minWidth: '300',
      sortable: false,
    },
  ],
  labels: ['animal tooth analysis', 'animal teeth analyses'],
  name: 'analysisZooTooth',
}

export default config
