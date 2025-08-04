export function useRemoveCachedAuthQueriesWatcher() {
  const userCachedQueries = useAppQueryCache('/api/admin/users')
  const siteUserPrivilegeCacheQueries = useAppQueryCache(
    '/api/admin/site_user_privileges',
  )

  const removeCachedAuthQueries = () => {
    userCachedQueries.removeQueries()
    siteUserPrivilegeCacheQueries.removeQueries()
  }

  return {
    removeCachedAuthQueries,
    userCachedQueries,
    siteUserPrivilegeCacheQueries,
  }
}

export default useRemoveCachedAuthQueriesWatcher
