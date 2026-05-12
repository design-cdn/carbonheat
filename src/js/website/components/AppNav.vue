<template>
  <nav :class="{ scrolled, 'menu-open': menuOpen }">
    <RouterLink to="/" class="logo" @click="closeMenu">
      <svg viewBox="0 0 129.2 30.62" fill="white" xmlns="http://www.w3.org/2000/svg" style="height:30px;display:block;flex-shrink:0" aria-label="Carbon Heat">
        <g>
          <path d="M41.59,21.06c-.85,1.02-1.96,1.51-3.21,1.51-2.68,0-4.58-1.92-4.58-4.58s1.9-4.58,4.58-4.58c1.26,0,2.39.55,3.24,1.51l-.91.68c-.66-.72-1.43-1.17-2.34-1.17-2.13,0-3.45,1.6-3.45,3.56s1.32,3.56,3.45,3.56c.94,0,1.75-.49,2.34-1.21l.87.72Z"/>
          <path d="M50.14,18.68c0,1.7.04,2.66.17,3.66h-1.06c-.08-.43-.11-.92-.11-1.41h-.04c-.64,1.11-1.58,1.64-3.05,1.64s-3.07-.74-3.07-2.58c0-2.66,3.11-2.92,4.83-2.92h1.32v-.53c0-1.51-1.06-2.11-2.45-2.11-1.02,0-1.89.32-2.66.98l-.66-.77c.83-.79,2.19-1.23,3.32-1.23,2.11,0,3.47.94,3.47,3.15v2.13ZM47.87,17.96c-1.89,0-3.77.47-3.77,1.96,0,1.07,1.04,1.62,1.98,1.62,2.41,0,3.04-1.55,3.04-3v-.58h-1.25Z"/>
          <path d="M53.16,16.08c0-.64-.09-2-.09-2.45h1.13c.02.64.04,1.36.08,1.53.57-1.02,1.47-1.75,2.77-1.75.23,0,.43.04.66.09l-.13,1.11c-.17-.06-.32-.08-.43-.08-1.96,0-2.85,1.36-2.85,3.05v4.75h-1.13v-6.26Z"/>
          <path d="M59.19,8.08h1.13v7.07h.04c.7-1.21,2.19-1.75,3.49-1.75,2.68,0,4.58,1.92,4.58,4.58s-1.9,4.58-4.58,4.58c-1.3,0-2.79-.55-3.49-1.75h-.04v1.53h-1.13v-14.25ZM63.85,21.55c2.13,0,3.45-1.6,3.45-3.56s-1.32-3.56-3.45-3.56-3.64,1.6-3.64,3.56,1.58,3.56,3.64,3.56Z"/>
          <path d="M75.06,13.4c2.68,0,4.58,1.92,4.58,4.58s-1.9,4.58-4.58,4.58-4.58-1.92-4.58-4.58,1.9-4.58,4.58-4.58ZM75.06,21.55c2.13,0,3.45-1.6,3.45-3.56s-1.32-3.56-3.45-3.56-3.45,1.6-3.45,3.56,1.32,3.56,3.45,3.56Z"/>
          <path d="M82.17,16.08c0-.64-.09-2-.09-2.45h1.13c.02.64.04,1.36.08,1.53h.06c.45-.96,1.57-1.75,2.98-1.75,2.72,0,3.32,1.85,3.32,3.75v5.19h-1.13v-5.13c0-1.41-.4-2.79-2.19-2.79-1.68,0-3.02,1.17-3.02,3.56v4.36h-1.13v-6.26Z"/>
          <path d="M100.88,16.68v5.66h-2.26v-4.98c0-1.07-.23-2.39-1.68-2.39s-2.13,1.23-2.13,2.43v4.94h-2.26v-14.25h2.26v6.47h.04c.36-.75,1.36-1.53,2.7-1.53,2.36,0,3.34,1.81,3.34,3.66Z"/>
          <path d="M112.15,18.53h-6.88c.1,1.28,1.26,2.23,2.58,2.23,1.13,0,1.89-.45,2.39-1.17l1.51,1.21c-.89,1.21-2.17,1.81-3.88,1.81-2.79,0-4.87-1.79-4.87-4.73s2.06-4.85,4.79-4.85c2.53,0,4.37,1.64,4.37,4.9,0,.21,0,.4-.02.6ZM109.9,16.91c0-1.17-.66-2.19-2.13-2.19-1.34,0-2.41.92-2.51,2.19h4.64Z"/>
          <path d="M119.86,21.19h-.06c-.45.79-1.53,1.38-2.81,1.38-1.45,0-3.39-.7-3.39-2.81,0-2.7,3.39-3.07,6.22-3.07v-.23c0-1.11-.94-1.66-2.07-1.66-.96,0-1.89.45-2.47,1.04l-1.17-1.38c1.02-.94,2.45-1.43,3.83-1.43,3.24,0,4.04,2,4.04,3.81v5.51h-2.11v-1.15ZM119.83,18.21h-.51c-1.43,0-3.45.17-3.45,1.51,0,.87.81,1.13,1.58,1.13,1.55,0,2.38-.89,2.38-2.32v-.32Z"/>
          <path d="M123.13,15.1v-1.81h1.58v-2.62h2.23v2.62h2.26v1.81h-2.26v4.2c0,.81.19,1.4,1.19,1.4.3,0,.7-.06.96-.19l.08,1.77c-.4.15-1,.25-1.51.25-2.39,0-2.94-1.47-2.94-3.21v-4.22h-1.58Z"/>
          <path d="M33.8,6.56c-.01-3.62-2.96-6.56-6.58-6.56s-6.58,2.95-6.58,6.58v17.45c0,2.06-1.67,3.73-3.73,3.73s-3.73-1.67-3.73-3.73V6.57h0c-.01-3.62-2.96-6.57-6.58-6.57S0,2.95,0,6.58v15.73h2.85V6.58c0-2.06,1.67-3.73,3.73-3.73s3.73,1.67,3.73,3.73v17.45c0,3.63,2.95,6.58,6.58,6.58s6.57-2.94,6.58-6.57h0V6.58c0-2.06,1.67-3.73,3.73-3.73s3.73,1.67,3.73,3.73v1.48h2.85v-1.5h0Z"/>
        </g>
      </svg>
    </RouterLink>

    <ul class="nav-links">
      <li v-for="link in navLinks" :key="link.to" :class="{ cur: $route.path === link.to }">
        <RouterLink :to="link.to">{{ t(link.key) }}</RouterLink>
      </li>
    </ul>

    <div class="nav-right">
      <button class="lang-btn" @click="toggleLocale">{{ isRo ? 'EN' : 'RO' }}</button>
      <RouterLink to="/despre-noi#contact" class="nav-cta">{{ t('nav.cta') }} <span class="nav-cta-arrow">›</span></RouterLink>
    </div>

    <button class="lang-btn lang-btn-mobile" @click="toggleLocale">{{ isRo ? 'EN' : 'RO' }}</button>

    <button
      class="burger"
      :class="{ open: menuOpen }"
      :aria-expanded="menuOpen"
      aria-label="Menu"
      @click="toggleMenu"
    >
      <span></span><span></span><span></span>
    </button>

    <transition name="overlay">
      <div v-if="menuOpen" class="mobile-overlay" @click.self="closeMenu">
        <div class="overlay-bg" aria-hidden="true">
          <span class="orb orb-1"></span>
          <span class="orb orb-3"></span>
        </div>

        <ul class="mobile-links">
          <li
            v-for="(link, i) in navLinks"
            :key="link.to"
            :class="{ cur: $route.path === link.to }"
            :style="{ '--d': `${0.18 + i * 0.07}s` }"
          >
            <RouterLink :to="link.to" @click="closeMenu">
              <span class="num">0{{ i + 1 }}</span>
              <span class="label">{{ t(link.key) }}</span>
              <span class="arrow">→</span>
            </RouterLink>
          </li>
        </ul>

        <div class="mobile-foot">
          <RouterLink to="/despre-noi#contact" class="nav-cta" @click="closeMenu" :style="{ '--d': '0.6s' }">
            {{ t('nav.cta') }} <span class="nav-cta-arrow">›</span>
          </RouterLink>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from '../useI18n.js';

const { t, isRo, toggleLocale } = useI18n();

const scrolled = ref(false);
const menuOpen = ref(false);
const route = useRoute();

function onScroll() {
  scrolled.value = window.scrollY > 60;
}

function toggleMenu() { menuOpen.value = !menuOpen.value; }
function closeMenu() { menuOpen.value = false; }

watch(menuOpen, (v) => {
  document.body.style.overflow = v ? 'hidden' : '';
});
watch(() => route.path, () => closeMenu());

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  document.body.style.overflow = '';
});

const navLinks = [
  { to: '/',                    key: 'nav.halls'      },
  { to: '/fotovoltaice',        key: 'nav.solar'      },
  { to: '/infrastructura-grea', key: 'nav.heavy'      },
  { to: '/automatizari-industriale', key: 'nav.automation' },
  { to: '/despre-noi',               key: 'nav.about'      },
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

nav.menu-open {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom-color: transparent;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

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

/* ─── Burger button ─── */
.lang-btn-mobile {
  display: none;
  margin-left: auto;
  margin-right: 4px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.12em;
  padding: 8px 10px;
  position: relative;
  z-index: 2;
}

.burger {
  display: none;
  position: relative;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  margin-left: auto;
  z-index: 2;
}

.burger span {
  position: absolute;
  left: 10px;
  right: 10px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s, top 0.4s, width 0.4s;
}

.burger span:nth-child(1) { top: 15px; }
.burger span:nth-child(2) { top: 21px; right: 14px; }
.burger span:nth-child(3) { top: 27px; }

.burger.open span:nth-child(1) { top: 21px; transform: rotate(45deg); }
.burger.open span:nth-child(2) { opacity: 0; transform: translateX(-12px); }
.burger.open span:nth-child(3) { top: 21px; transform: rotate(-45deg); right: 10px; }

/* ─── Mobile overlay ─── */
.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: rgba(2, 13, 26, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 100px 32px 40px;
  overflow: hidden;
}

.overlay-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.overlay-bg .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.55;
  animation: orbDrift 14s ease-in-out infinite;
}

.orb-1 {
  width: 320px; height: 320px;
  background: #2c77fa;
  top: -80px; left: -100px;
  animation-delay: -2s;
}
.orb-3 {
  width: 420px; height: 420px;
  background: #10d4d8;
  top: 40%; right: -120px;
  animation-delay: -4s;
  opacity: 0.4;
}

@keyframes orbDrift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(30px, -20px) scale(1.08); }
}

.mobile-links {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.mobile-links li {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  opacity: 0;
  transform: translateY(24px);
  animation: linkIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) var(--d) forwards;
}

.mobile-links li:first-child { border-top: 1px solid rgba(255, 255, 255, 0.06); }

.mobile-links a {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 4px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.88);
  font: 700 28px/1 'Outfit', sans-serif;
  letter-spacing: -0.02em;
  position: relative;
  overflow: hidden;
}

.mobile-links .num {
  font: 500 12px/1 'Outfit', sans-serif;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.12em;
  width: 28px;
  flex-shrink: 0;
}

.mobile-links .label {
  flex: 1;
  position: relative;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), color 0.3s;
}

.mobile-links .arrow {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.3);
  transform: translateX(-8px);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s, color 0.3s;
}

.mobile-links li.cur .label { color: #2c77fa; }
.mobile-links li.cur .arrow { color: #2c77fa; opacity: 1; transform: translateX(0); }

.mobile-links a:active .label { transform: translateX(6px); }
.mobile-links a:active .arrow { opacity: 1; transform: translateX(0); color: #fff; }

.mobile-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  position: relative;
}

.mobile-foot .lang-btn,
.mobile-foot .nav-cta {
  opacity: 0;
  transform: translateY(16px);
  animation: linkIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) var(--d) forwards;
}

.mobile-foot .lang-btn {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50px;
  padding: 11px 22px;
  letter-spacing: 0.12em;
}

.mobile-foot .nav-cta { padding: 13px 28px; font-size: 14px; }

@keyframes linkIn {
  to { opacity: 1; transform: translateY(0); }
}

/* overlay enter/leave */
.overlay-enter-active { transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1); }
.overlay-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.overlay-enter-from { opacity: 0; transform: translateY(-12px); }
.overlay-leave-to   { opacity: 0; transform: translateY(-8px); }

@media (max-width: 900px) {
  nav { padding: 0 20px; }
  .nav-links, .nav-right { display: none; }
  .burger { display: block; margin-left: 0; }
  .lang-btn-mobile { display: inline-block; }
}
</style>
