<script setup>
const { isAuthenticated } = useAppAuth()
const AuthUserMenu = resolveComponent('AuthUserMenu')
const AuthLoginIcon = resolveComponent('AuthLoginIcon')
const authComponent = computed(() =>
  isAuthenticated.value ? AuthUserMenu : AuthLoginIcon,
)
</script>

<template>
  <component :is="authComponent" />
</template>
