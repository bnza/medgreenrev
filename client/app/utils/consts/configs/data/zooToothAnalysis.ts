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
      key: 'type.value',
      value: 'type',
      title: 'type',
      minWidth: '150',
    },
    {
      key: 'document.mimeType',
      value: 'document.mimeType',
      title: 'document',
      maxWidth: '200',
      minWidth: '200',
    },
    {
      key: 'rawData.mimeType',
      value: 'rawData.mimeType',
      title: 'raw data',
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
  name: 'zooToothAnalysis',
}

export default config
