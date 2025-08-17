import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/admin/users',
  appPath: '/admin/users',
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
      key: 'email',
      value: 'email',
      title: 'email',
      width: '200',
    },
    {
      key: 'role',
      title: 'role',
      sortable: false,
      width: 50,
    },
    {
      key: 'geo_archaeologist',
      title: 'geo archaeologist',
      sortable: false,
      width: 50,
      align: 'center',
    },
    {
      key: 'ceramic_specialist',
      title: 'ceramic specialist',
      sortable: false,
      width: 50,
      align: 'center',
    },
    {
      key: 'zoo_archaeologist',
      title: 'zoo archaeologist',
      sortable: false,
      width: 50,
      align: 'center',
    },
  ],
  labels: ['user', 'users'],
  name: 'user',
}

export default config
