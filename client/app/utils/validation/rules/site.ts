import type {RegleComputedRules} from "@regle/core";
import {required} from "@regle/rules";
import type {ValidationRequestBody} from "~~/types";

export const create = computed(
  () => ({
    code: { required },
    name: { required },
  } satisfies RegleComputedRules<Partial<ValidationRequestBody<'create', '/api/sites'>>>)
)

export default {
  create,
}
