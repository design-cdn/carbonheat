<template>
  <section class="cta-section">
    <div class="cta-bg"></div>
    <div class="cta-overlay"></div>
    <div class="cnt">
      <div class="cta-block">
        <p class="sec-label">{{ t(prefix + '.label') }}</p>
        <h2 class="cta-h2">{{ t(prefix + '.heading') }}</h2>
        <p class="cta-sub">{{ t(prefix + '.sub') }}</p>
        <RouterLink :to="btnTo" class="btn-outline">{{ t(prefix + '.btn') }} <span style="margin-left:8px">›</span></RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from '../useI18n.js';

const { t } = useI18n();

const props = defineProps({
  prefix: { type: String, default: 'cta' },
  btnTo:  { type: String, default: '/despre-noi#contact' },
});

const { prefix, btnTo } = props;
</script>

<style scoped>
.cta-section {
  padding: 140px 0;
  background: #031739;
  position: relative;
  overflow: hidden;
  min-height: 600px;
}

.cta-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 70% at 50% 50%, rgba(44,119,250,0.28) 0%, transparent 65%),
    radial-gradient(ellipse 70% 50% at 15% 80%, rgba(16,212,192,0.14) 0%, transparent 55%),
    radial-gradient(ellipse 60% 60% at 85% 20%, rgba(80,30,180,0.16) 0%, transparent 55%);
}

.cta-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 100% at 50% 50%, rgba(3,23,57,0.45) 0%, rgba(3,23,57,0.85) 100%);
  pointer-events: none;
}

.cnt {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 56px;
  position: relative;
  z-index: 2;
}

.cta-block {
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.sec-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
  font-family: 'Outfit', sans-serif;
}

.cta-h2 {
  font-size: clamp(36px, 4.5vw, 64px);
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.08;
  font-family: 'Outfit', sans-serif;
}

.cta-sub {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.68);
  margin-bottom: 44px;
  font-weight: 300;
  font-family: 'Outfit', sans-serif;
  line-height: 1.6;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  padding: 11px 26px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.88);
  font: 500 13px/1 'Outfit', sans-serif;
  text-decoration: none;
  border-radius: 50px;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.btn-outline:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

@media (max-width: 640px) {
  .cnt { padding: 0 24px; }
  .cta-section { padding: 100px 0; }
}
</style>
