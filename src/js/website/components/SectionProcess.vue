<template>
  <section class="differentiator">
    <div class="process-header cnt">
      <div class="process-header-left">
        <p class="sec-label">{{ t('process.label') }}</p>
        <h2 class="sec-h2" v-html="t('process.heading')"></h2>
      </div>
      <div class="process-header-right">
        <p class="sec-body">{{ t('process.intro') }}</p>
        <div class="process-scroll-hint">
          <i class="ph ph-arrow-right"></i>
          <span>{{ t('process.scrollHint') }}</span>
        </div>
      </div>
    </div>

    <div class="process-track-wrap" ref="trackWrapEl">
      <div class="process-track">
        <div
          v-for="(card, i) in cards"
          :key="i"
          class="process-card"
          :class="{ 'process-card-final': i === cards.length - 1, visible: visibleCards[i] }"
          :ref="el => cardRefs[i] = el"
        >
          <div class="pc-num">{{ String(i + 1).padStart(2, '0') }}</div>
          <div class="pc-icon"><i :class="'ph ' + card.icon"></i></div>
          <div class="pc-content">
            <div class="pc-title">{{ card.title }}</div>
            <div class="pc-desc">{{ card.desc }}</div>
            <ul class="pc-details">
              <li v-for="detail in card.details" :key="detail">
                <i class="ph ph-check"></i> {{ detail }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="process-progress cnt">
      <div class="process-progress-track">
        <div class="process-progress-fill" :style="{ width: progressPct + '%' }"></div>
      </div>
      <div class="process-step-counter">
        <span class="psc-current">{{ String(currentStep + 1).padStart(2, '0') }}</span>
        <span class="psc-sep">/</span>
        <span class="psc-total">{{ String(cards.length).padStart(2, '0') }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../useI18n.js';

const { t } = useI18n();

const trackWrapEl = ref(null);
const cardRefs = reactive([]);
const visibleCards = reactive({});
const progressPct = ref(0);
const currentStep = ref(0);

const cards = [
  {
    icon: 'ph-magnifying-glass',
    title: 'Consultare & Evaluare',
    desc: 'Vizităm șantierul, analizăm documentația structurală și identificăm cerințele specifice ale beneficiarului. Stabilim împreună scopul, bugetul orientativ și calendarul.',
    details: ['Vizită tehnică pe teren', 'Analiză documentație structurală', 'Identificare cerințe specifice', 'Estimare orientativă'],
  },
  {
    icon: 'ph-pencil-ruler',
    title: 'Proiectare tehnică',
    desc: 'Elaborăm proiectele tehnice pentru fiecare specialitate — sanitare, VAC, electrice, BMS, stingere incendiu, CCTV. Coordonăm toate disciplinele într-un singur pachet coerent.',
    details: ['Proiecte per specialitate', 'Coordonare inter-disciplinară', 'Memorii tehnice', 'Listele de materiale'],
  },
  {
    icon: 'ph-seal-check',
    title: 'Aprobare & Contractare',
    desc: 'Prezentăm proiectul tehnic, obținem aprobarea beneficiarului și semnăm contractul de execuție. Includem toate specialitățile sub un singur document contractual.',
    details: ['Prezentare proiect tehnic', 'Negociere și ajustări', 'Contract unic, 11 sisteme', 'Grafic de execuție'],
  },
  {
    icon: 'ph-hard-hat',
    title: 'Execuție',
    desc: 'Montăm toate sistemele în ordinea logică de execuție, coordonat cu antreprenorul general. Urmărim calitatea zilnic și raportăm progresul săptămânal către beneficiar.',
    details: ['Montaj sisteme în etape logice', 'Coordonare cu antreprenorul general', 'Rapoarte săptămânale de progres', 'Control calitate zilnic'],
  },
  {
    icon: 'ph-checks',
    title: 'Testare & Punere în funcțiune',
    desc: 'Testăm fiecare sistem separat și integrat. Efectuăm reglajele finale, probe de funcționare și verificări conform normativelor. Documentăm toate rezultatele.',
    details: ['Teste individuale per sistem', 'Probe integrate', 'Reglaje și calibrări finale', 'Procese verbale de probe'],
  },
  {
    icon: 'ph-trophy',
    title: 'Predare & Garanție',
    desc: 'Predăm hala funcțională împreună cu documentația completă — cărți tehnice, scheme as-built, certificate. Asigurăm suport în perioada de garanție.',
    details: ['Recepție la terminarea lucrărilor', 'Cărți tehnice și scheme as-built', 'Certificate de conformitate', 'Garanție și suport post-predare'],
  },
];

let io = null;

function onScroll() {
  const wrap = trackWrapEl.value;
  if (!wrap) return;
  const max = wrap.scrollWidth - wrap.clientWidth;
  const pct = max > 0 ? (wrap.scrollLeft / max) * 100 : 0;
  progressPct.value = pct;
  currentStep.value = Math.min(Math.round((pct / 100) * (cards.length - 1)), cards.length - 1);
}

// Drag scroll
let isDown = false, startX = 0, scrollLeft = 0;

function onMouseDown(e) {
  isDown = true;
  trackWrapEl.value.classList.add('grabbing');
  startX = e.pageX - trackWrapEl.value.offsetLeft;
  scrollLeft = trackWrapEl.value.scrollLeft;
}
function onMouseLeave() { isDown = false; trackWrapEl.value.classList.remove('grabbing'); }
function onMouseUp() { isDown = false; trackWrapEl.value.classList.remove('grabbing'); }
function onMouseMove(e) {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - trackWrapEl.value.offsetLeft;
  trackWrapEl.value.scrollLeft = scrollLeft - (x - startX) * 1.2;
}

onMounted(() => {
  const wrap = trackWrapEl.value;
  wrap.addEventListener('scroll', onScroll, { passive: true });
  wrap.addEventListener('mousedown', onMouseDown);
  wrap.addEventListener('mouseleave', onMouseLeave);
  wrap.addEventListener('mouseup', onMouseUp);
  wrap.addEventListener('mousemove', onMouseMove);

  io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.index) || 0;
        setTimeout(() => { visibleCards[idx] = true; }, idx * 120);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cardRefs.forEach((el, i) => {
    if (el) { el.dataset.index = i; io.observe(el); }
  });
});

onUnmounted(() => {
  const wrap = trackWrapEl.value;
  if (wrap) {
    wrap.removeEventListener('scroll', onScroll);
    wrap.removeEventListener('mousedown', onMouseDown);
    wrap.removeEventListener('mouseleave', onMouseLeave);
    wrap.removeEventListener('mouseup', onMouseUp);
    wrap.removeEventListener('mousemove', onMouseMove);
  }
  if (io) io.disconnect();
});
</script>

<style scoped>
.differentiator {
  padding: 140px 0 80px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  overflow: visible;
}

.cnt {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 56px;
}

.process-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: end;
  margin-bottom: 64px;
}

.process-header-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: flex-end;
}

.sec-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #2c77fa;
  margin-bottom: 20px;
  font-family: 'Outfit', sans-serif;
}

.sec-h2 {
  font-size: clamp(32px, 3.5vw, 54px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: #fff;
  margin-bottom: 28px;
  font-family: 'Outfit', sans-serif;
}

.sec-body {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.8;
  font-weight: 300;
  font-family: 'Outfit', sans-serif;
}

.process-scroll-hint {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.05em;
  font-family: 'Outfit', sans-serif;
}

.process-scroll-hint i {
  font-size: 16px;
  color: #2c77fa;
  animation: arrowPulse 1.8s ease-in-out infinite;
}

@keyframes arrowPulse {
  0%, 100% { transform: translateX(0); opacity: 1; }
  50%       { transform: translateX(6px); opacity: 0.5; }
}

.process-track-wrap {
  overflow-x: auto;
  overflow-y: visible;
  padding: 40px 56px 100px;
  cursor: grab;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.process-track-wrap::-webkit-scrollbar { display: none; }
.process-track-wrap.grabbing { cursor: grabbing; }

.process-track {
  display: flex;
  align-items: stretch;
  gap: 16px;
  width: max-content;
  padding-bottom: 40px;
}

.process-card {
  width: 340px;
  background: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-shrink: 0;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.4s ease,
              opacity 0.5s ease;
  opacity: 0;
  transform: translateY(80px) scale(0.88);
  position: relative;
  overflow: hidden;
}

.process-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 20%,
    rgba(147, 197, 253, 0.12) 35%,
    rgba(167, 139, 250, 0.10) 45%,
    rgba(96, 165, 250, 0.14) 55%,
    rgba(199, 210, 254, 0.08) 65%,
    transparent 80%
  );
  border-radius: 12px;
  transform: translateX(-120%);
  z-index: 0;
  pointer-events: none;
}

.process-card:hover::before {
  animation: shineWipe 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.process-card:hover {
  transform: scale(1.09) translateY(-10px) !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.2),
              0 0 0 1px rgba(44,119,250,0.25),
              0 30px 80px rgba(44,119,250,0.55) !important;
  z-index: 10;
  opacity: 1 !important;
}

@keyframes shineWipe {
  0%   { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}

.process-card > * { position: relative; z-index: 1; }

.process-card.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.process-track:has(.process-card:hover) .process-card:not(:hover) {
  opacity: 0.45;
  transform: scale(0.95) !important;
}

.process-card-final {
  background: #2c77fa !important;
  border-color: #2c77fa !important;
}

.process-card-final::before { display: none !important; }

.process-card-final .pc-num  { color: rgba(255,255,255,0.5); }
.process-card-final .pc-icon { border-color: rgba(255,255,255,0.3); color: #fff; background: rgba(255,255,255,0.15); }
.process-card-final .pc-title { color: #fff; }
.process-card-final .pc-desc  { color: rgba(255,255,255,0.8); }
.process-card-final .pc-details li   { color: rgba(255,255,255,0.75); }
.process-card-final .pc-details li i { color: rgba(255,255,255,0.95); }

.process-card-final:hover {
  box-shadow: 0 24px 60px rgba(44,119,250,0.5), 0 0 0 1px rgba(255,255,255,0.2) !important;
}

.pc-num {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(0, 0, 0, 0.2);
  font-family: 'Outfit', sans-serif;
}

.pc-icon {
  width: 72px;
  height: 72px;
  border: 1.5px solid rgba(44, 119, 250, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #2c77fa;
  background: rgba(44, 119, 250, 0.06);
  transition: border-color 0.3s, transform 0.3s;
}

.process-card:hover .pc-icon { transform: scale(1.06); }

.pc-title {
  font-size: 26px;
  font-weight: 700;
  color: #0a1628;
  letter-spacing: -0.02em;
  margin-bottom: 14px;
  line-height: 1.2;
  font-family: 'Outfit', sans-serif;
}

.pc-desc {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  line-height: 1.75;
  font-weight: 300;
  font-family: 'Outfit', sans-serif;
}

.pc-details {
  list-style: none;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pc-details li {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Outfit', sans-serif;
}

.pc-details li i { color: #2c77fa; font-size: 13px; flex-shrink: 0; }

.process-progress {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 16px;
}

.process-progress-track {
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  overflow: hidden;
}

.process-progress-fill {
  height: 100%;
  background: #2c77fa;
  border-radius: 2px;
  transition: width 0.15s;
}

.process-step-counter {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Outfit', sans-serif;
}

.psc-current {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255,255,255,0.75);
  letter-spacing: 0.05em;
  min-width: 20px;
}

.psc-sep  { font-size: 11px; color: rgba(255,255,255,0.2); }
.psc-total { font-size: 13px; color: rgba(255,255,255,0.2); letter-spacing: 0.05em; }

@media (max-width: 1024px) {
  .process-header { grid-template-columns: 1fr; gap: 40px; }
}
</style>
