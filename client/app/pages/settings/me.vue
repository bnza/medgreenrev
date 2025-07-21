<template>
  <Suspense>
    <data-collection-page-current-user-site-user-privilege />
    <template #fallback>
      <loading-component />
    </template>
  </Suspense>
</template>
