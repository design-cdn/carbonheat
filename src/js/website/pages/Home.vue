<template>
  <div class="page-home">
    <AppNav />
    <AppHero />
    <SectionFeatures />
    <SectionProcess />
    <SectionSpecializations />
    <SectionProjects />
    <SectionCta />
    <AppFooter />
  </div>
</template>

<script setup>
import AppNav              from '../components/AppNav.vue';
import AppHero             from '../components/AppHero.vue';
import SectionFeatures     from '../components/SectionFeatures.vue';
import SectionProcess      from '../components/SectionProcess.vue';
import SectionSpecializations from '../components/SectionSpecializations.vue';
import SectionProjects     from '../components/SectionProjects.vue';
import SectionCta          from '../components/SectionCta.vue';
import AppFooter           from '../components/AppFooter.vue';
</script>

<style>
/* Global for home page */
html, body {
  background: #031739;
  color: #d8eaf6;
  font-family: 'Outfit', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Subtle grid overlay */
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
  background: #031739;
  position: relative;
}
</style>
