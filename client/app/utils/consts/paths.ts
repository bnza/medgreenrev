import type { GetCollectionPath, GetItemPath } from "~~/types";
import type { RepositoryPath } from "~/repositories/Api";

// Single strict mapping for both collection and item paths
export const PATH_TO_REPOSITORY_MAP: Record<GetCollectionPath | GetItemPath, RepositoryPath> = {
  '/api/sites': '/api/sites',
  '/api/sites/{id}': '/api/sites',
  '/api/users': '/api/users',
  '/api/users/{id}': '/api/users',
  "/api/users/me": "/api/users",
  "/api/site_user_privileges": "/api/site_user_privileges",
  "/api/site_user_privileges/{id}": "/api/site_user_privileges",
} as const;
