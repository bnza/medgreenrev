import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/paleoclimate_sampling_sites',
  appPath: '/data/sites/paleoclimate-sampling',
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
      key: 'code',
      value: 'code',
      title: 'code',
      width: '200',
    },
    {
      key: 'name',
      value: 'name',
      title: 'name',
      width: '200',
    },
    {
      key: 'region.value',
      value: 'region.value',
      title: 'region',
      minWidth: '200',
    },
    {
      key: 'description',
      value: 'description',
      title: 'description',
      sortable: false,
    },
  ],
  labels: ['paleoclimate sampling site', 'paleoclimate sampling sites'],
  name: 'paleoclimateSamplingSite',
}

export default config
