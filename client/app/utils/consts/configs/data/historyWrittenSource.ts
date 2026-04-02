import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/history/written_sources',
  appPath: '/data/history/written-sources',
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
      key: 'centuries.century.chronologyLower',
      value: 'centuries.century.chronologyLower',
      title: 'century',
      width: '100',
      maxWidth: '100',
    },
    {
      key: 'writtenSourceType.value',
      value: 'writtenSourceType.value',
      title: 'type',
      width: '100',
      maxWidth: '100',
    },
    {
      key: 'author.value',
      value: 'author.value',
      title: 'author',
      width: '200',
      maxWidth: '200',
    },
    {
      key: 'title',
      value: 'title',
      title: 'title',
      width: '200',
      maxWidth: '200',
    },
    {
      key: 'publicationDetails',
      value: 'publicationDetails',
      title: 'publication details',
      width: '300',
      maxWidth: '300',
    },
  ],
  labels: ['history written source', 'history written sources'],
  name: 'historyWrittenSource',
}

export default config
