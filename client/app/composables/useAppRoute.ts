import { useRoute } from 'vue-router'

export default function useAppRoute() {
  const route = useRoute()

  const routeIds = route.params.id

  const routeId = (Array.isArray(routeIds) ? routeIds[0] : routeIds) || ''

  return {
    route,
    routeId,
    routeIds,
  }
}
