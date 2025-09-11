import type { ResourceConfig } from '~~/types'

export const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/analyses/contexts/zoo',
  appPath: '/data/analysis/context/zoo',
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
      key: 'item.site.code',
      value: 'item.site.code',
      title: 'site',
      minWidth: '100',
    },
    {
      key: 'item.name',
      value: 'item.name',
      title: 'context',
      minWidth: '100',
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
  labels: ['zooarchaeological analyses', 'zooarchaeological analyses'],
  name: 'contextZooAnalysis',
}

export default config
