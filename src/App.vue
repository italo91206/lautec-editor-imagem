<template>
  <main id="app">
    <AppLayout>
      <router-view></router-view>
    </AppLayout>
  </main>
</template>

<script>
import AppLayout from '@/layouts/AppLayout'

export default {
  name: 'App',
  components: { AppLayout }
}
</script>

<style>

</style>