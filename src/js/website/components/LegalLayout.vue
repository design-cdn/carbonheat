<template>
  <div class="legal-page">
    <AppNav />
    <main class="legal-main">
      <div class="cnt">
        <p class="legal-eyebrow">{{ eyebrow }}</p>
        <h1 class="legal-title">{{ title }}</h1>
        <p v-if="updated" class="legal-updated">{{ t('legal.updated') }}: {{ updated }}</p>
        <div class="legal-body">
          <slot />
        </div>
      </div>
    </main>
    <SectionContact />
    <AppFooter />
  </div>
</template>

<script setup>
import AppNav         from './AppNav.vue';
import AppFooter      from './AppFooter.vue';
import SectionContact from './SectionContact.vue';
import { useI18n }    from '../useI18n.js';

const { t } = useI18n();

defineProps({
  eyebrow: { type: String, default: '' },
  title:   { type: String, default: '' },
  updated: { type: String, default: '' },
});
</script>

<style>
/* Global on legal pages */
.legal-page {
  background: #031739;
  color: #d8eaf6;
  font-family: 'Outfit', sans-serif;
  min-height: 100vh;
}
.legal-page::before {
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
.legal-main {
  padding: 160px 0 100px;
  position: relative;
  z-index: 2;
}

.cnt {
  max-width: 820px;
  margin: 0 auto;
  padding: 0 56px;
}

.legal-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #2c77fa;
  margin: 0 0 18px;
}

.legal-title {
  font-size: clamp(34px, 5vw, 64px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: #fff;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #ffffff 0%, #cce0ff 60%, #6aa9ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.legal-updated {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  margin: 0 0 56px;
  letter-spacing: 0.02em;
}

.legal-body :deep(h2) {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.015em;
  margin: 56px 0 16px;
}

.legal-body :deep(h2:first-child) { margin-top: 0; }

.legal-body :deep(h3) {
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin: 28px 0 10px;
}

.legal-body :deep(p) {
  font-size: 15px;
  font-weight: 300;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.72);
  margin: 0 0 14px;
}

.legal-body :deep(ul),
.legal-body :deep(ol) {
  font-size: 15px;
  font-weight: 300;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.72);
  margin: 0 0 14px;
  padding-left: 24px;
}

.legal-body :deep(li) { margin-bottom: 6px; }

.legal-body :deep(strong) {
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
}

.legal-body :deep(a) {
  color: #6aa9ff;
  text-decoration: underline;
  text-decoration-color: rgba(106, 169, 255, 0.35);
  text-underline-offset: 3px;
  transition: color 0.2s;
}
.legal-body :deep(a:hover) { color: #fff; }

.legal-body :deep(.legal-callout) {
  margin: 24px 0;
  padding: 18px 22px;
  border-radius: 12px;
  background: rgba(44, 119, 250, 0.06);
  border-left: 3px solid #2c77fa;
  font-size: 14px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.78);
}

@media (max-width: 640px) {
  .legal-main { padding: 120px 0 80px; }
  .cnt { padding: 0 24px; }
  .legal-body :deep(h2) { font-size: 19px; margin: 40px 0 12px; }
}
</style>
