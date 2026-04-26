<template>
  <div class="sys-timeline" id="sys-timeline">
    <template v-for="(sys, i) in SYSTEMS" :key="i">
      <div v-if="i > 0" class="st-line"></div>
      <div
        class="st-item"
        :class="{
          active:   activeSys === i,
          done:     activeSys > i && activeSys < SYSTEMS.length,
          'all-done': activeSys >= SYSTEMS.length,
        }"
        :style="{ '--stc': '#' + sys.color.toString(16).padStart(6, '0') }"
      >
        <div class="st-dot"></div>
        <span class="st-label">{{ abbrs[locale][i] }}</span>
      </div>
    </template>

    <div class="st-line"></div>
    <div class="st-item st-extra" :class="{ 'all-done': activeSys >= SYSTEMS.length }">
      <div class="st-dot"></div>
      <span class="st-label">{{ t('sys.other') }}</span>
    </div>
  </div>
</template>

<script setup>
import { SYSTEMS } from '../composables/useMepSystems.js';
import { useI18n } from '../useI18n.js';

defineProps({
  activeSys: { type: Number, default: -1 },
});

const { t, locale } = useI18n();

const abbrs = {
  ro: ['ELECTRIC', 'HVAC', 'SANITAR', 'INCENDIU', 'BMS'],
  en: ['ELECTRIC', 'HVAC', 'SANITARY', 'FIRE',    'BMS'],
};
</script>

<style scoped>
.sys-timeline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-top: 40px;
  opacity: 0;
  pointer-events: none;
  animation: stFadeIn 0.8s ease 3.4s forwards;
}

@keyframes stFadeIn { to { opacity: 1; } }

.st-item {
  display: flex;
  align-items: center;
  gap: 0;
  position: relative;
}

/* Vertical bar — NOT a circle */
.st-dot {
  width: 1.5px;
  height: 22px;
  background: rgba(255, 255, 255, 0.18);
  flex-shrink: 0;
  transition: background 0.4s, box-shadow 0.4s, height 0.3s;
}

.st-item.active .st-dot {
  background: var(--stc);
  box-shadow: 0 0 10px var(--stc);
  height: 32px;
}

.st-item.done .st-dot {
  background: rgba(255, 255, 255, 0.35);
  height: 22px;
}

.st-item.all-done .st-dot {
  background: var(--stc);
  box-shadow: 0 0 8px var(--stc);
  height: 28px;
}

.st-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
  white-space: nowrap;
  margin-left: 14px;
  font-family: 'Outfit', sans-serif;
  transition: color 0.4s;
}

.st-item.active .st-label  { color: rgba(255, 255, 255, 0.95); }
.st-item.done .st-label    { color: rgba(255, 255, 255, 0.38); }
.st-item.all-done .st-label { color: rgba(255, 255, 255, 0.90); }

.st-line {
  height: 1px;
  width: clamp(24px, 4vw, 60px);
  background: rgba(255, 255, 255, 0.08);
  margin: 0 10px;
  flex-shrink: 0;
  transition: background 0.4s;
}

.st-extra .st-dot {
  background: rgba(255, 255, 255, 0.10);
  height: 16px;
}

.st-extra .st-label {
  color: rgba(255, 255, 255, 0.20);
  letter-spacing: 0.22em;
}

.st-extra.all-done .st-dot {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: none;
}

.st-extra.all-done .st-label {
  color: rgba(255, 255, 255, 0.45);
}
</style>
