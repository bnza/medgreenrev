export function useRemoveCachedAuthQueriesWatcher() {
  const userCachedQueries = useAppQueryCache('/api/users')
  const siteUserPrivilegeCacheQueries = useAppQueryCache(
    '/api/site_user_privileges',
  )

  const removeCachedAuthQueries = () => {
    console.log(userCachedQueries.caches)
    console.log(siteUserPrivilegeCacheQueries.caches)
    userCachedQueries.removeQueries()
    siteUserPrivilegeCacheQueries.removeQueries()
    console.log(userCachedQueries.caches)
    console.log(siteUserPrivilegeCacheQueries.caches)
  }

  return {
    removeCachedAuthQueries,
    userCachedQueries,
    siteUserPrivilegeCacheQueries,
  }
}

export default useRemoveCachedAuthQueriesWatcher
