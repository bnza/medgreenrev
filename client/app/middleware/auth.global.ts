export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.public) return;

  const {isAuthenticated} = useAppAuth();
  const historyStack = useHistoryStackStore();
  if (!isAuthenticated.value) {
    historyStack.push({path: to.fullPath, isUserAction: false});
    return navigateTo('/login');
  }
});
