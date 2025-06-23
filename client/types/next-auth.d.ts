import type {DefaultSession} from 'next-auth'
import type {ApiRole} from "~/utils/consts/auth";

declare module 'next-auth' {
  interface Session extends DefaultSession {
    id: string;
    email: string;
    roles: Array<ApiRole>;
    privileges: Record<number, number>;
  }
}
