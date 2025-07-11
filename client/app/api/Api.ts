import type { GetCollectionPath } from "~~/types";
import { BaseApiRepository } from "~/api/repositories/BaseApiRepository";
import { UserRepository } from "~/api/repositories/UserRepository";
import { SiteRepository } from "~/api/repositories/SiteRepository";
import { SiteUserPrivilegeRepository } from "~/api/repositories/SiteUserPrivilegeRepository";

export type RepositoryPath = keyof RepositoryReturnMap;
// Define specific return types for each repository
type RepositoryReturnMap = {
  '/api/users': UserRepository;
  '/api/sites': SiteRepository;
  '/api/site_user_privileges': SiteUserPrivilegeRepository;
  '/api/sites/{siteId}/user_privileges': SiteUserPrivilegeRepository;
  // Add other repository return types here
};

export class Api {
  // Create a cache for repository instances
  private repositoryCache = new Map<GetCollectionPath, BaseApiRepository<any, any, any, any, any>>();

  getRepository<T extends GetCollectionPath>(
    path: T
  ) {
    // Check cache first
    const cached = this.repositoryCache.get(path);
    if (cached) {
      return cached as T extends keyof RepositoryReturnMap ? RepositoryReturnMap[T] : never;
    }

    // Repository mapping
    const repositoryMap = {
      '/api/users': UserRepository,
      '/api/sites': SiteRepository,
      '/api/site_user_privileges': SiteUserPrivilegeRepository,
      '/api/sites/{siteId}/user_privileges': SiteUserPrivilegeRepository
    };

    // Constructor arguments mapping (for dynamic paths)
    const constructorArgsMap = {
      '/api/sites/{siteId}/user_privileges': {
        collectionPath: '/api/sites/{siteId}/user_privileges',
        itemPath: '/api/sites/{siteId}/user_privileges/{id}',
      }
      // Example: Override paths for specific repositories
      // '/api/users': {
      //   collectionPath: '/api/sites/{siteId}/users',
      //   itemPath: '/api/sites/{siteId}/users/{id}',
      //   postPath: '/api/users'
      // },
    };

    // Get the repository constructor
    const RepositoryClass = repositoryMap[path as keyof typeof repositoryMap];

    // Only instantiate if the repository class exists in the map
    if (!RepositoryClass) {
      throw new Error(`Repository not found for path: ${path}`);
    }

    // Use constructor arguments if available, otherwise use empty constructor
    const constructorArgs = constructorArgsMap[path as keyof typeof constructorArgsMap];

    const instance = new RepositoryClass(constructorArgs)

    // Cache the instance
    this.repositoryCache.set(path, instance);

    return instance
  }
}
