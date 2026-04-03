import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/history/written_sources_cited_works',
  appPath: '/data/history/written-sources/cited-works',
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
      key: 'writtenSource.author.value',
      value: 'writtenSource.author.value',
      title: 'author',
      width: '200',
      maxWidth: '200',
    },
    {
      key: 'writtenSource.title',
      value: 'writtenSource.title',
      title: 'written source',
      width: '300',
      maxWidth: '300',
    },
    {
      key: 'citedWork.value',
      value: 'citedWork.value',
      title: 'cited work',
    },
    {
      key: 'yearCompleted',
      value: 'yearCompleted',
      title: 'year completed',
    },
    // {
    //   key: 'yearCompletedUpper',
    //   value: 'yearCompletedUpper',
    //   title: 'year completed (upper)',
    // },
  ],
  labels: ['cited work (written source)', 'cited works (written sources)'],
  name: 'historyWrittenSourceCitedWork',
}

export default config
