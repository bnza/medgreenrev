import { AclVoters } from '~/utils/consts/auth'

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    voters?: AclVoters[]
  }
}
