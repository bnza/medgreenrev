import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOpenApiStore } from '~/stores/openapi'
import openApiFixture from '../../fixtures/openapi.response.json'
import type { paths } from '~~/types'

describe('useOpenApiStore', () => {
  describe('findApiResourcePath', () => {
    let store: ReturnType<typeof useOpenApiStore>

    beforeEach(() => {
      setActivePinia(createPinia())
      store = useOpenApiStore()

      // Set the fixture data as the internal spec
      store.specInternal = openApiFixture as any
    })

    describe('when target path is already an API resource path', () => {
      it('should return the same path for single resource endpoints', () => {
        const targetPath = '/api/data/sites' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).to.equal('/api/data/sites')
      })

      it('should return the same path for site user privileges resource', () => {
        const targetPath = '/api/admin/site_user_privileges' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).to.equal('/api/admin/site_user_privileges')
      })
    })

    describe('when target path is a collection endpoint', () => {
      it('should find corresponding resource path for sites collection', () => {
        const targetPath = '/api/data/sites/{id}' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).to.equal('/api/data/sites')
      })

      it('should find corresponding resource path for site user privileges collection', () => {
        const targetPath = '/api/admin/site_user_privileges/{id}' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).to.equal('/api/admin/site_user_privileges')
      })

      it('should match endpoints by shared tags', () => {
        const targetPath = '/api/data/sites/{id}' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        // Verify that both endpoints have the same tag
        //@ts-expect-error Property get does not exist on type
        const targetTags = openApiFixture.paths[targetPath]?.get?.tags || []
        const resultTags = openApiFixture.paths[result!]?.get?.tags || []

        expect(targetTags).to.include('Site')
        expect(resultTags).to.include('Site')
        expect(result).to.equal('/api/data/sites')
      })
    })

    describe('when target path has no matching resource', () => {
      it('should return undefined for login endpoint with different tag', () => {
        const targetPath = '/api/login' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).to.equal(undefined)
      })

      it('should return undefined for non-existent paths', () => {
        const targetPath = '/api/non-existent' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).to.equal(undefined)
      })
    })

    describe.skip('when openApi spec conditions are not met', () => {
      it('should return undefined when specInternal is not set', () => {
        store.specInternal = undefined as any
        const targetPath = '/api/data/sites' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).to.equal(undefined)
      })

      it('should return undefined when target path has no GET operation', () => {
        // Mock a spec with no GET operation for the target path
        const mockSpec = {
          ...openApiFixture,
          paths: {
            ...openApiFixture.paths,
            '/api/test-no-get': {
              post: {
                operationId: 'test_post',
                tags: ['Test'],
                responses: {},
              },
            },
          },
        }
        store.specInternal = mockSpec as any

        const targetPath = '/api/test-no-get' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).to.equal(undefined)
      })

      it('should return undefined when paths object is missing', () => {
        const specWithoutPaths = {
          ...openApiFixture,
          paths: undefined,
        }
        store.specInternal = specWithoutPaths as any

        const targetPath = '/api/data/sites' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).to.equal(undefined)
      })
    })

    describe.skip('tag matching edge cases', () => {
      it('should handle endpoints with no tags', () => {
        const mockSpec = {
          ...openApiFixture,
          paths: {
            '/api/test-no-tags': {
              get: {
                operationId: 'test_get',
                // No tags property
                responses: {},
              },
            },
            '/api/test-no-tags/{id}': {
              get: {
                operationId: 'test_get_item',
                // No tags property
                responses: {},
              },
            },
          },
        }
        store.specInternal = mockSpec as any

        const targetPath = '/api/test-no-tags' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        // Should match since both have empty/undefined tags arrays
        expect(result).to.equal('/api/test-no-tags/{id}')
      })

      it('should handle endpoints with empty tags array', () => {
        const mockSpec = {
          ...openApiFixture,
          paths: {
            '/api/test-empty-tags': {
              get: {
                operationId: 'test_get',
                tags: [], // Empty array
                responses: {},
              },
            },
            '/api/test-empty-tags/{id}': {
              get: {
                operationId: 'test_get_item',
                tags: [], // Empty array
                responses: {},
              },
            },
          },
        }
        store.specInternal = mockSpec as any

        const targetPath = '/api/test-empty-tags' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        // Should match since both have empty tags arrays
        expect(result).to.equal('/api/test-empty-tags/{id}')
      })

      it('should return first matching resource when multiple resources share tags', () => {
        const mockSpec = {
          ...openApiFixture,
          paths: {
            '/api/data/sites': openApiFixture.paths['/api/data/sites'],
            '/api/data/sites/{id}':
              openApiFixture.paths['/api/data/sites/{id}'],
            '/api/data/sites2/{id}': {
              get: {
                operationId: 'api_sites2_id_get',
                tags: ['Site'], // Same tag as sites
                responses: {
                  '200': {
                    description: 'Site resource',
                    content: {
                      'application/ld+json': {
                        schema: {
                          $ref: '#/components/schemas/Site.jsonld-site.acl.read',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }
        store.specInternal = mockSpec as any

        const targetPath = '/api/data/sites' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        // Should return one of the matching resource paths
        expect(result).to.match(/^\/api\/sites.*\{id\}$/)
      })
    })

    describe('real fixture data validation', () => {
      it('should correctly identify Site tag relationships', () => {
        const resourcePath = '/api/data/sites' as keyof paths
        const itemPath = '/api/data/sites/{id}' as keyof paths

        const collectionTags =
          //@ts-expect-error Property get does not exist on type
          openApiFixture.paths[resourcePath]?.get?.tags || []
        //@ts-expect-error Property get does not exist on type
        const resourceTags = openApiFixture.paths[itemPath]?.get?.tags || []

        expect(collectionTags).to.deep.equal(['Site'])
        expect(resourceTags).to.deep.equal(['Site'])

        const result = store.findApiResourcePath(itemPath)
        expect(result).to.equal(resourcePath)
      })

      it('should correctly identify SiteUserPrivilege tag relationships', () => {
        const collectionPath = '/api/admin/site_user_privileges' as keyof paths
        const itemPath = '/api/admin/site_user_privileges/{id}' as keyof paths

        const collectionTags =
          //@ts-expect-error Property get does not exist on type
          openApiFixture.paths[collectionPath]?.get?.tags || []
        //@ts-expect-error Property get does not exist on type
        const resourceTags = openApiFixture.paths[itemPath]?.get?.tags || []

        expect(collectionTags).to.deep.equal(['SiteUserPrivilege'])
        expect(resourceTags).to.deep.equal(['SiteUserPrivilege'])

        const result = store.findApiResourcePath(itemPath)
        expect(result).to.equal(collectionPath)
      })

      it('should not match login endpoint due to different tags', () => {
        const loginPath = '/api/login' as keyof paths
        //@ts-expect-error Property post does not exist on type
        const loginTags = openApiFixture.paths[loginPath]?.post?.tags || []

        expect(loginTags).to.deep.equal(['Login Check'])

        const result = store.findApiResourcePath(loginPath)
        expect(result).to.equal(undefined)
      })
    })

    describe('store integration', () => {
      it('should work within the store context with proper reactivity', () => {
        expect(store.ready).to.equal(true)

        const result = store.findApiResourcePath(
          '/api/data/sites/{id}' as keyof paths,
        )
        expect(result).to.equal('/api/data/sites')
      })
    })
  })
})
