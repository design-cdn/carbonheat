<template>
  <div class="sys-timeline" id="sys-timeline" :class="{ 'is-done': activeSys >= SYSTEMS.length }">
    <template v-for="(sys, i) in SYSTEMS" :key="i">
      <div v-if="i > 0" class="st-line"></div>
      <div
        class="st-item"
        :class="{
          active:     activeSys === i,
          done:       activeSys > i && activeSys < SYSTEMS.length,
          'all-done': activeSys >= SYSTEMS.length,
          open:       activeSys >= SYSTEMS.length && openIdx === i,
        }"
        :style="{ '--stc': '#' + sys.color.toString(16).padStart(6, '0') }"
        @click="toggle(i)"
      >
        <div class="st-header">
          <div class="st-dot">
            <i :class="'ph ' + icons[i]"></i>
          </div>
          <span class="st-label">{{ labels[locale][i] }}</span>
          <i class="ph ph-caret-down st-caret"></i>
        </div>
        <div class="st-body">
          <p>{{ descriptions[locale][i] }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { SYSTEMS } from '../composables/useMepSystems.js';
import { useI18n } from '../useI18n.js';

const props = defineProps({
  activeSys: { type: Number, default: -1 },
});

const { locale } = useI18n();

const icons = ['ph-lightning', 'ph-wind', 'ph-drop', 'ph-fire-extinguisher', 'ph-cpu'];

const labels = {
  ro: ['Instalații Electrice', 'Instalații HVAC', 'Instalații Sanitare', 'Instalații Stingere Incendiu', 'Building Management Sistems'],
  en: ['Electrical Systems',  'HVAC Systems',    'Sanitary Systems',    'Fire Suppression',             'Building Management Systems'],
};

const descriptions = {
  ro: [
    'Distribuție de forță, iluminat tehnologic și prize industriale, cu tablouri și protecții complete.',
    'Ventilație, climatizare și tratare aer pentru hale și spații tehnice, cu integrare în BMS.',
    'Apă rece, caldă, canalizare menajeră și pluvială, dimensionate pentru încărcările halei.',
    'Sprinklere, hidranți și detecție automată, conform normativelor ISU și polițelor de asigurare.',
    'Automatizare și supervizare unitară pentru toate instalațiile, cu raportare și acces la distanță.',
  ],
  en: [
    'Power distribution, technological lighting and industrial sockets, with complete switchboards and protections.',
    'Ventilation, air conditioning and air handling for halls and technical spaces, integrated with BMS.',
    'Cold water, hot water, sewage and stormwater drainage, sized for the hall’s loads.',
    'Sprinklers, hydrants and automatic detection, compliant with fire authority and insurance requirements.',
    'Unified automation and supervision for all systems, with reporting and remote access.',
  ],
};

const openIdx = ref(-1);
function toggle(i) {
  if (props.activeSys < SYSTEMS.length) return;
  openIdx.value = openIdx.value === i ? -1 : i;
}
</script>

<style scoped>
.sys-timeline {
  display: flex;
  align-items: stretch;
  justify-content: center;
  margin-top: 48px;
  opacity: 0;
  text-align: left;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  animation: stFadeIn 0.8s ease 3.4s forwards;
}

@keyframes stFadeIn { to { opacity: 1; } }

.st-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 20px;
  min-width: 0;
  position: relative;
  transition: background 0.3s;
}

.st-header {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  width: 100%;
}

.st-body { display: none; }
.st-caret { display: none; }

.st-item:hover { background: rgba(255, 255, 255, 0.03); }
.st-item.active { background: rgba(255, 255, 255, 0.05); }

.st-dot {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 22px;
  color: rgba(255, 255, 255, 0.4);
  transition: border-color 0.4s, color 0.4s, background 0.4s, box-shadow 0.4s;
}

.st-item.active .st-dot {
  border-color: var(--stc);
  color: var(--stc);
  background: color-mix(in srgb, var(--stc) 12%, transparent);
  box-shadow: 0 0 16px color-mix(in srgb, var(--stc) 30%, transparent);
}

.st-item.done .st-dot {
  border-color: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.5);
}

.st-item.all-done .st-dot {
  border-color: var(--stc);
  color: var(--stc);
  background: color-mix(in srgb, var(--stc) 8%, transparent);
}

.st-label {
  font-size: 17px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.25);
  transition: color 0.4s;
  line-height: 1.3;
  letter-spacing: 0.01em;
  font-family: 'Outfit', sans-serif;
}

.st-item.active .st-label  { color: #fff; }
.st-item.done .st-label    { color: rgba(255, 255, 255, 0.35); }
.st-item.all-done .st-label { color: #fff; }

.st-line {
  width: 1px;
  background: rgba(255, 255, 255, 0.08);
  align-self: stretch;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .sys-timeline {
    margin-top: 32px;
    flex-direction: column;
    align-items: stretch;
  }
  .st-line { display: none; }
  .st-item {
    flex: none;
    display: none;
    flex-direction: column;
    align-items: stretch;
    padding: 18px 20px;
    gap: 0;
  }
  .st-item.active { display: flex; }
  .sys-timeline:not(.is-done):not(:has(.st-item.active)) .st-item:first-of-type {
    display: flex;
  }
  .st-label { font-size: 16px; flex: 1; min-width: 0; }

  .sys-timeline.is-done {
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    padding: 14px 8px;
  }
  .sys-timeline.is-done .st-item {
    display: flex;
    flex: 0 0 auto;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: default;
  }
  .sys-timeline.is-done .st-header { width: auto; }
  .sys-timeline.is-done .st-label,
  .sys-timeline.is-done .st-caret,
  .sys-timeline.is-done .st-body { display: none; }
  .sys-timeline.is-done .st-dot {
    width: 44px;
    height: 44px;
    font-size: 20px;
  }
}
</style>
