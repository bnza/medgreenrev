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
      width: '250',
    },
    {
      key: 'role',
      title: 'role',
      sortable: false,
      width: 120,
    },
    {
      key: 'enabled',
      title: 'enabled',
      width: 70,
      align: 'center',
    },
    {
      key: 'anthropologist',
      title: 'anthropologist',
      sortable: false,
      width: 70,
      align: 'center',
    },
    {
      key: 'archaoeobotanist',
      title: 'archaoeobotanist',
      sortable: false,
      width: 70,
      align: 'center',
    },
    {
      key: 'ceramic_specialist',
      title: 'ceramic specialist',
      sortable: false,
      width: 70,
      align: 'center',
    },
    {
      key: 'geo_archaeologist',
      title: 'geo archaeologist',
      sortable: false,
      width: 70,
      align: 'center',
    },
    {
      key: 'historian',
      title: 'historian',
      sortable: false,
      width: 70,
      align: 'center',
    },
    {
      key: 'material_analyst',
      title: 'material analyst',
      sortable: false,
      width: 70,
      align: 'center',
    },
    {
      key: 'paleoclimatologist',
      title: 'paleoclimatologist',
      sortable: false,
      width: 70,
      align: 'center',
    },
    {
      key: 'zoo_archaeologist',
      title: 'zoo archaeologist',
      sortable: false,
      width: 70,
      align: 'center',
    },
  ],
  labels: ['user', 'users'],
  name: 'user',
}

export default config
