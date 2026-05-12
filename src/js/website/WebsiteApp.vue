<template>
  <RouterView />
  <WhatsAppFab />
  <CookieConsent />
</template>

<script setup>
import WhatsAppFab   from './components/WhatsAppFab.vue';
import CookieConsent from './components/CookieConsent.vue';
</script>
