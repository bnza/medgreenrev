<template>
  <Suspense>
    <template #default>
      <!-- This slot will contain your lazy components -->
      <slot />
    </template>

    <template #fallback>
      <loading-component />
    </template>
  </Suspense>
</template>
