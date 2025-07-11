
import useAppQuerySite from "~/composables/queries/useAppQuerySite";
import useAppQueryUser from "~/composables/queries/useAppQueryUser";
import type { GetCollectionPath, GetItemPath } from "~~/types";
import type {RepositoryPath} from "~/api/Api";

const queryComposableMap = {
  '/api/sites': useAppQuerySite,
  '/api/users': useAppQueryUser,
  // Add other repository paths as needed
} as const;

const pathToRepositoryMap: Record<GetCollectionPath | GetItemPath, RepositoryPath> = {
  '/api/sites': '/api/sites',
  '/api/sites/{id}': '/api/sites',
  '/api/users': '/api/users',
  '/api/users/{id}': '/api/users',
  "/api/users/me": "/api/users",
  "/api/site_user_privileges": "/api/site_user_privileges",
  "/api/site_user_privileges/{id}": "/api/site_user_privileges",
  "/api/sites/{siteId}/user_privileges": "/api/site_user_privileges",
  "/api/sites/{siteId}/user_privileges/{id}": "/api/site_user_privileges",
} as const;

type QueryPath = keyof typeof queryComposableMap;

export class RepositoryQueryFactory {
  private getComposable<T extends QueryPath>(path: T) {
    const composable = queryComposableMap[path];
    if (!composable) {
      throw new Error(`No query composable found for repository path: ${path}`);
    }

    return composable(path);
  }

  hasComposable(path: string): path is QueryPath {
    return path in queryComposableMap;
  }

  getRepositoryPath(path: GetCollectionPath | GetItemPath): RepositoryPath {
    const repositoryPath = pathToRepositoryMap[path];
    if (!repositoryPath) {
      throw new Error(`No repository mapping found for path: ${path}`);
    }
    return repositoryPath;
  }

  getQuery<T extends GetCollectionPath | GetItemPath>(path: T) {
    const repositoryPath = this.getRepositoryPath(path)
    if (!this.hasComposable(repositoryPath)) {
      throw new Error(`No query composable found for repository path: ${repositoryPath}`);
    }
    return this.getComposable(repositoryPath);
  }
}

export const repositoryQueryFactory = new RepositoryQueryFactory();
