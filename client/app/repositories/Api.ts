import type { GetCollectionPath } from "~~/types";
import { BaseApiRepository } from "./BaseApiRepository";
import { SiteRepository } from "./SiteRepository";
import { UserRepository } from "./UserRepository";
import {SiteUserRepository} from "~/repositories/SiteUserRepository";

export type RepositoryPath = keyof RepositoryMap;

// Define the repository map
type RepositoryMap = {
  '/api/users': typeof UserRepository;
  '/api/sites': typeof SiteRepository;
  '/api/site_user_privileges': typeof SiteUserRepository;
  // Add other repository mappings here
};

// Define specific return types for each repository
type RepositoryReturnMap = {
  '/api/users': UserRepository<'/api/users', '/api/users/{id}'>;
  '/api/sites': SiteRepository<'/api/sites', '/api/sites/{id}'>;
  '/api/site_user_privileges': SiteUserRepository<'/api/site_user_privileges', '/api/site_user_privileges/{id}'>;
  // Add other repository return types here
};

// Define constructor arguments map (optional)
type ConstructorArgsMap = {
  // '/api/users'?: {
  //   collectionPath?: '/api/users';
  //   itemPath?: '/api/users/{id}';
  // };
  // '/api/sites'?: {
  //   collectionPath?: '/api/sites';
  //   itemPath?: '/api/sites/{id}';
  // };
  // Add other constructor arguments as needed
};

export class Api {
  // Create a cache for repository instances
  private repositoryCache = new Map<GetCollectionPath, BaseApiRepository<any, any>>();

  // Type-safe repository factory function
  getRepository<T extends GetCollectionPath>(
    path: T
  ): T extends keyof RepositoryReturnMap
    ? RepositoryReturnMap[T]
    : never {

    // Check cache first
    const cached = this.repositoryCache.get(path);
    if (cached) {
      return cached as T extends keyof RepositoryReturnMap ? RepositoryReturnMap[T] : never;
    }

    // Repository mapping
    const repositoryMap: RepositoryMap = {
      '/api/users': UserRepository,
      '/api/sites': SiteRepository,
      '/api/site_user_privileges': SiteUserRepository
    };

    // Constructor arguments mapping (optional)
    const constructorArgsMap: ConstructorArgsMap = {
      // '/api/users': {
      //   collectionPath: '/api/users',
      //   itemPath: '/api/users/{id}',
      // },
      // '/api/sites': {
      //   collectionPath: '/api/sites',
      //   itemPath: '/api/sites/{id}',
      // },
    };

    // Get the repository constructor
    const RepositoryClass = repositoryMap[path as keyof RepositoryMap];

    // Only instantiate if the repository class exists in the map
    if (!RepositoryClass) {
      throw new Error(`Repository not found for path: ${path}`);
    }

    // Use constructor arguments if available, otherwise use empty constructor
    const constructorArgs = constructorArgsMap[path as keyof ConstructorArgsMap];
    const instance = constructorArgs ? new RepositoryClass(constructorArgs) : new RepositoryClass();

    // Cache the instance
    this.repositoryCache.set(path, instance);

    return instance as T extends keyof RepositoryReturnMap ? RepositoryReturnMap[T] : never;
  }
}
