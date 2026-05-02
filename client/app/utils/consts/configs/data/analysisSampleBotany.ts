import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/analyses/samples/botany',
  appPath: '/data/analyses/samples/botany',
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
      key: 'flat.value',
      value: 'flat.value',
      title: 'taxonomy',
      minWidth: '200',
    },
    {
      key: 'taxonomy.flat.class',
      value: 'taxonomy.flat.class',
      title: 'class',
      minWidth: '150',
    },
    {
      key: 'taxonomy.flat.family',
      value: 'taxonomy.flat.family',
      title: 'family',
      minWidth: '150',
    },
    {
      key: 'taxonomy.flat.genus',
      value: 'taxonomy.flat.genus',
      title: 'genus',
      minWidth: '150',
    },
    {
      key: 'taxonomy.flat.species',
      value: 'taxonomy.flat.species',
      title: 'species',
      minWidth: '200',
    },
    {
      key: 'cf',
      value: 'cf',
      title: 'cf',
      maxWidth: '100',
      minWidth: '100',
    },
    {
      key: 'sp',
      value: 'sp',
      title: 'sp',
      maxWidth: '100',
      minWidth: '100',
    },
    {
      key: 'type',
      value: 'type',
      title: 'type',
      maxWidth: '100',
      minWidth: '100',
    },
  ],
  labels: ['assemblage botany analysis', 'assemblage botany analyses'],
  name: 'analysisSampleBotany',
}

export default config
