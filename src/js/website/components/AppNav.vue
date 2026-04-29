<template>
  <nav :class="{ scrolled }">
    <RouterLink to="/" class="logo">
      <svg viewBox="0 0 36.65 32.23" height="26" fill="white" style="flex-shrink:0;display:block" aria-hidden="true">
        <path d="M33.8,6.56c-.01-3.62-2.96-6.56-6.58-6.56s-6.58,2.95-6.58,6.58v17.45c0,2.06-1.67,3.73-3.73,3.73s-3.73-1.67-3.73-3.73V6.57h0c-.01-3.62-2.96-6.57-6.58-6.57S0,2.95,0,6.58v15.73h2.85V6.58c0-2.06,1.67-3.73,3.73-3.73s3.73,1.67,3.73,3.73v17.45c0,3.63,2.95,6.58,6.58,6.58s6.57-2.94,6.58-6.57h0V6.58c0-2.06,1.67-3.73,3.73-3.73s3.73,1.67,3.73,3.73v1.48h2.85v-1.5h0Z"/>
      </svg>
      <span class="logo-name">carbon<b>heat</b></span>
    </RouterLink>

    <ul class="nav-links">
      <li v-for="link in navLinks" :key="link.to" :class="{ cur: $route.path === link.to }">
        <RouterLink :to="link.to">{{ t(link.key) }}</RouterLink>
      </li>
    </ul>

    <div class="nav-right">
      <button class="lang-btn" @click="toggleLocale">{{ isRo ? 'EN' : 'RO' }}</button>
      <RouterLink to="/contact" class="nav-cta">{{ t('nav.cta') }} <span class="nav-cta-arrow">›</span></RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../useI18n.js';

const { t, isRo, toggleLocale } = useI18n();

const scrolled = ref(false);

function onScroll() {
  scrolled.value = window.scrollY > 60;
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));

const navLinks = [
  { to: '/',                    key: 'nav.halls'      },
  { to: '/fotovoltaice',        key: 'nav.solar'      },
  { to: '/infrastructura-grea', key: 'nav.heavy'      },
  { to: '/automatizari',        key: 'nav.automation' },
  { to: '/despre',              key: 'nav.about'      },
];
</script>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 300;
  display: flex;
  align-items: center;
  padding: 0 56px;
  transition: background 0.35s, backdrop-filter 0.35s;
}

nav.scrolled {
  background: rgba(2, 13, 26, 0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
}

.logo-name {
  font-size: 15px;
  font-weight: 300;
  color: white;
  letter-spacing: 0.01em;
  font-family: 'Outfit', sans-serif;
}

.logo-name b { font-weight: 700; }

.nav-links {
  display: flex;
  list-style: none;
  gap: 0;
  margin: 0 auto;
}

.nav-links a {
  font-size: 13.5px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  transition: color 0.2s;
  padding: 0 22px;
  height: 80px;
  display: flex;
  align-items: center;
  font-family: 'Outfit', sans-serif;
}

.nav-links li.cur a {
  color: #fff;
  font-weight: 700;
  position: relative;
}

.nav-links li.cur a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 22px;
  right: 22px;
  height: 2px;
  background: #2c77fa;
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left;
  animation: navUnderline 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
}

@keyframes navUnderline { to { transform: scaleX(1); } }

.nav-links a:hover { color: rgba(255, 255, 255, 0.88); }

.nav-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.lang-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.38);
  font: 500 12px/1 'Outfit', sans-serif;
  letter-spacing: 0.08em;
  padding: 4px 2px;
  cursor: pointer;
  transition: color 0.2s;
}

.lang-btn:hover { color: rgba(255, 255, 255, 0.7); }

.nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 26px;
  background: transparent;
  color: rgba(255, 255, 255, 0.88);
  font: 500 13px/1 'Outfit', sans-serif;
  letter-spacing: 0.03em;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.nav-cta:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.nav-cta-arrow {
  font-size: 14px;
  transition: transform 0.2s;
}

.nav-cta:hover .nav-cta-arrow { transform: translateX(2px); }
</style>
