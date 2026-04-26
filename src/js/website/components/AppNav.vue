<template>
  <nav class="ch-nav">
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
      <RouterLink to="/contact" class="nav-cta">{{ t('nav.cta') }}</RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from '../useI18n.js';

const { t, isRo, toggleLocale } = useI18n();

const navLinks = [
  { to: '/',                    key: 'nav.halls'      },
  { to: '/fotovoltaice',        key: 'nav.solar'      },
  { to: '/infrastructura-grea', key: 'nav.heavy'      },
  { to: '/automatizari',        key: 'nav.automation' },
  { to: '/despre',              key: 'nav.about'      },
];
</script>

<style scoped>
.ch-nav {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 300;
  display: flex;
  align-items: center;
  padding: 0 48px;
  background: linear-gradient(to bottom, rgba(2,13,26,0.97) 0%, transparent 100%);
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
  font-size: 16px;
  font-weight: 400;
  color: white;
  font-family: 'Outfit', sans-serif;
}

.logo-name b { font-weight: 700; }

.nav-links {
  display: flex;
  list-style: none;
  gap: 30px;
  margin-left: 44px;
}

.nav-links a {
  font-size: 13px;
  font-weight: 400;
  color: #8aaabb;
  text-decoration: none;
  transition: color 0.2s;
  position: relative;
  padding-bottom: 9px;
  font-family: 'Outfit', sans-serif;
}

.nav-links li.cur a {
  color: #d8eaf6;
  font-weight: 700;
}

.nav-links li.cur a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.5px;
  background: #2888f0;
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: left;
  animation: navUnderline 0.5s cubic-bezier(0.4,0,0.2,1) 0.3s forwards;
}

@keyframes navUnderline { to { transform: scaleX(1); } }

.nav-links a:hover { color: #d8eaf6; }

.nav-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.lang-btn {
  background: none;
  border: 1px solid rgba(255,255,255,0.13);
  color: #8aaabb;
  font: 500 11px/1 'Outfit', sans-serif;
  letter-spacing: 0.1em;
  padding: 5px 11px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-btn:hover {
  border-color: rgba(255,255,255,0.35);
  color: #d8eaf6;
}

.nav-cta {
  padding: 10px 24px;
  border: 1px solid rgba(40,136,240,0.55);
  background: rgba(40,136,240,0.10);
  color: #2888f0;
  font: 600 13px/1 'Outfit', sans-serif;
  letter-spacing: 0.06em;
  border-radius: 2px;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}

.nav-cta:hover {
  background: rgba(40,136,240,0.22);
  border-color: rgba(40,136,240,0.9);
  transform: translateY(-1px);
}
</style>
