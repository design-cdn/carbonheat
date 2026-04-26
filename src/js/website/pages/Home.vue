<template>
  <div class="page-home">
    <AppNav />
    <AppHero />
  </div>
</template>

<script setup>
import AppNav  from '../components/AppNav.vue';
import AppHero from '../components/AppHero.vue';
</script>

<style>
/* Global for this page — body overflow hidden matches prototype */
html, body {
  height: 100%;
  overflow: hidden;
  background: #020d1a;
  color: #d8eaf6;
  font-family: 'Outfit', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Subtle grid overlay matching prototype */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(20,80,140,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(20,80,140,0.035) 1px, transparent 1px);
  background-size: 56px 56px;
}
</style>

<style scoped>
.page-home {
  background: #020d1a;
}
</style>
