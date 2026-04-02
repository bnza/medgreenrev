import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/vocabulary/history/authors',
  appPath: '/data/vocabulary/history/authors',
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
      key: 'value',
      value: 'value',
      title: 'value',
      minWidth: '200',
    },
    {
      key: 'variant',
      value: 'variant',
      title: 'variant',
      minWidth: '200',
    },
  ],
  labels: ['author (historical data)', 'authors (historical data)'],
  name: 'vocHistoryAuthor',
}

export default config
