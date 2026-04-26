<template>
  <div class="page-stub">
    <AppNav />
    <main class="page-stub__body">
      <h1>{{ title }}</h1>
    </main>
  </div>
</template>

<script setup>
import AppNav from '../components/AppNav.vue';

const title = 'Fotovoltaice';
</script>

<style scoped>
.page-stub {
  background: #020d1a;
  min-height: 100vh;
}
.page-stub__body {
  padding-top: 100px;
  padding-left: 5%;
  font-family: 'Outfit', sans-serif;
  color: #fff;
}
</style>
