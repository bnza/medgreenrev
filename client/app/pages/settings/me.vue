<template>
  <Suspense>
    <data-item-page-user-me />
    <template #fallback>
      <loading-component />
    </template>
  </Suspense>
</template>
