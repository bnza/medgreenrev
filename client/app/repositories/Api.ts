import type { GetCollectionPath } from "~~/types";
import { BaseApiRepository } from "./BaseApiRepository";
import { SiteRepository } from "./SiteRepository";
import { UserRepository } from "./UserRepository";
import {SiteUserRepository} from "~/repositories/SiteUserRepository";

export type RepositoryPath = keyof RepositoryReturnMap;
// Define specific return types for each repository
type RepositoryReturnMap = {
  '/api/users': UserRepository<'/api/users', '/api/users/{id}'>;
  '/api/sites': SiteRepository<'/api/sites', '/api/sites/{id}'>;
  '/api/site_user_privileges': SiteUserRepository<'/api/site_user_privileges', '/api/site_user_privileges/{id}'>;
  // Add other repository return types here
};

export class Api {
  // Create a cache for repository instances
  private repositoryCache = new Map<GetCollectionPath, BaseApiRepository<any, any, any>>();

  // Type-safe repository factory function
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
      '/api/site_user_privileges': SiteUserRepository
    };

    // Constructor arguments mapping (optional)
    const constructorArgsMap = {
      // '/api/users': {
      //   collectionPath: '/api/sites/{siteId}/users',
      //   itemPath: '/api/sites/{siteId}/users/{id}',
      //   postPath: '/api/users/
      //   patchPath: '/api/users/{id}
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
