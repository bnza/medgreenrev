import type {ValidatedHttpMethod, ValidationMethodToPath, ValidationRequestBody} from "~~/types";
import type {ReglePartialRuleTree} from "@regle/core";

import site from './site'
import site_user_privileges from './site_user_privileges'

// Create specific type mappings to avoid conditional type issues
type CreateSiteRules = ReglePartialRuleTree<ValidationRequestBody<'create', '/api/sites'>>
type CreateSiteUserPrivilegesRules = ReglePartialRuleTree<ValidationRequestBody<'create', '/api/site_user_privileges'>>
type UpdateSiteUserPrivilegesRules = ReglePartialRuleTree<ValidationRequestBody<'update', '/api/site_user_privileges/{id}'>>

const rules = {
  create: {
    '/api/sites': site.create as ComputedRef<CreateSiteRules>,
    '/api/site_user_privileges': site_user_privileges.create as ComputedRef<CreateSiteUserPrivilegesRules>,
  },
  update: {
    '/api/site_user_privileges/{id}': site_user_privileges.update as ComputedRef<UpdateSiteUserPrivilegesRules>,
  },
} as const

// Function overloads for strict typing
export function getRules<M extends ValidatedHttpMethod, P extends ValidationMethodToPath<M>>(
  method: M,
  path: P
): ComputedRef<ReglePartialRuleTree<ValidationRequestBody<M,P>>>

// Implementation
export function getRules(method: ValidatedHttpMethod, path: string) {
  const isValidKey = (value: unknown): value is keyof typeof rules => typeof value === 'string' && value in rules
  if (!isValidKey(method)) {
    throw new Error(`No validation rules found for method: ${method}`)
  }
  const methodRules = rules[method]

  const pathRules = methodRules[path as keyof typeof methodRules]
  if (!pathRules) {
    throw new Error(`No validation rules found for method: ${method}, path: ${path}`)
  }

  return pathRules as any
}
