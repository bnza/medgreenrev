import type { ResourceConfig } from '~~/types'

export const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/analyses/contexts/zoo',
  appPath: '/data/analyses/context/zoo',
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
      key: 'subject.site.code',
      value: 'subject.site.code',
      title: 'site',
      minWidth: '100',
    },
    {
      key: 'subject.name',
      value: 'subject.name',
      title: 'context',
      minWidth: '100',
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
  labels: ['zooarchaeological analysis', 'zooarchaeological analyses'],
  name: 'analysisContextZoo',
}

export default config
