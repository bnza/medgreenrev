import type { GetCollectionPath, GetItemPath } from "~~/types";
import type { RepositoryPath } from "~/repositories/Api";
import {PATH_TO_REPOSITORY_MAP} from "~/utils/consts/paths";

export const apiResourceItemIriRegexp =
  /^(.+\/)(\d+|[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/

/**
 * Maps GetCollectionPath or GetItemPath to their corresponding RepositoryPath
 */
export function mapGetPathToRepositoryPath(path: GetCollectionPath | GetItemPath): RepositoryPath {
  const repositoryPath = PATH_TO_REPOSITORY_MAP[path];
  if (!repositoryPath) {
    throw new Error(`No repository mapping found for path: ${path}`);
  }
  return repositoryPath;
}
