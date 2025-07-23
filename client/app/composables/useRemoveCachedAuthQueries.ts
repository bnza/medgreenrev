export function useRemoveCachedAuthQueriesWatcher() {
  const userCachedQueries = useAppQueryCache('/api/users')
  const siteUserPrivilegeCacheQueries = useAppQueryCache(
    '/api/site_user_privileges',
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
