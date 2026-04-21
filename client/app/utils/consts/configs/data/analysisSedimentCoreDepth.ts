import type { ResourceConfig } from '~~/types'
const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/analyses/sediment_core_depths',
  appPath: '/data/analyses/sediment-core-depths',
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
      key: 'subject.code',
      value: 'subject.code',
      title: 'sediment core depth',
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
      key: 'analysis.type.value',
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
  labels: ['sediment core depth analysis', 'sediment core depth analyses'],
  name: 'analysisSedimentCoreDepth',
}
export default config
