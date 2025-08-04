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
      key: 'roles',
      value: 'roles',
      title: 'roles',
      sortable: false,
    },
  ],
  labels: ['user', 'users'],
  name: 'user',
}

export default config
