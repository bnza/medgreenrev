import { AclVoters, ApiRole } from '~/utils/consts/auth'

type VoteResult = { granted: boolean; message?: string; redirectTo?: string }

export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.public) return

  const { isAuthenticated } = useAppAuth()
  const historyStack = useHistoryStackStore()
  if (!isAuthenticated.value) {
    historyStack.pushForcedLogin(to.fullPath)
    return navigateTo('/login')
  }

  if (to.meta.voters && !Array.isArray(to.meta.voters)) {
    console.warn('Invalid voters meta format', to.meta.voters)
  }
  const voters: AclVoters[] = Array.isArray(to.meta.voters)
    ? to.meta.voters
    : []
  const { hasRoleAdmin, hasRole } = useAppAuth()
  const { addError } = useMessagesStore()

  const hasRoleAdminVoter = (voteResult: VoteResult): VoteResult => {
    voteResult.granted = hasRoleAdmin.value
    if (!voteResult.granted) {
      voteResult.message = 'Insufficient privileges: role ADMIN required'
    }
    return voteResult
  }
  const hasRoleEditorVoter = (voteResult: VoteResult): VoteResult => {
    voteResult.granted = hasRole(ApiRole.Editor).value
    if (!voteResult.granted) {
      voteResult.message = 'Insufficient privileges: role EDITOR required'
    }
    return voteResult
  }

  const allVoters: Record<AclVoters, (voteResult: VoteResult) => VoteResult> = {
    [AclVoters.HasRoleAdmin]: hasRoleAdminVoter,
    [AclVoters.HasRoleEditor]: hasRoleEditorVoter,
  } as const

  const vote = voters.reduce((acc, voter) => allVoters[voter](acc), {
    granted: true,
    redirectTo: '/',
  } as VoteResult)

  if (!vote.granted) {
    addError(vote.message || 'Navigation forbidden')
    if (vote.redirectTo) {
      return navigateTo(vote.redirectTo)
    }
  }
})
