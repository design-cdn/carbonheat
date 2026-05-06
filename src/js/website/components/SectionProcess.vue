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
          :style="{ '--card-accent': card.accent }"
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../useI18n.js';

const { t } = useI18n();

const trackWrapEl = ref(null);
const cardRefs = reactive([]);
const visibleCards = reactive({});
const progressPct = ref(0);
const currentStep = ref(0);

const cards = computed(() => [
  {
    accent: '#2c77fa',
    icon: 'ph-magnifying-glass',
    title: t('process.step0.title'),
    desc: t('process.step0.desc'),
    details: [t('process.step0.d0'), t('process.step0.d1'), t('process.step0.d2'), t('process.step0.d3')],
  },
  {
    accent: '#4f46e5',
    icon: 'ph-pencil-ruler',
    title: t('process.step1.title'),
    desc: t('process.step1.desc'),
    details: [t('process.step1.d0'), t('process.step1.d1'), t('process.step1.d2'), t('process.step1.d3')],
  },
  {
    accent: '#7c3aed',
    icon: 'ph-seal-check',
    title: t('process.step2.title'),
    desc: t('process.step2.desc'),
    details: [t('process.step2.d0'), t('process.step2.d1'), t('process.step2.d2'), t('process.step2.d3')],
  },
  {
    accent: '#0891b2',
    icon: 'ph-hard-hat',
    title: t('process.step3.title'),
    desc: t('process.step3.desc'),
    details: [t('process.step3.d0'), t('process.step3.d1'), t('process.step3.d2'), t('process.step3.d3')],
  },
  {
    accent: '#0d9488',
    icon: 'ph-checks',
    title: t('process.step4.title'),
    desc: t('process.step4.desc'),
    details: [t('process.step4.d0'), t('process.step4.d1'), t('process.step4.d2'), t('process.step4.d3')],
  },
  {
    accent: '#10d4c0',
    icon: 'ph-trophy',
    title: t('process.step5.title'),
    desc: t('process.step5.desc'),
    details: [t('process.step5.d0'), t('process.step5.d1'), t('process.step5.d2'), t('process.step5.d3')],
  },
]);

let io = null;

function onScroll() {
  const wrap = trackWrapEl.value;
  if (!wrap) return;
  const max = wrap.scrollWidth - wrap.clientWidth;
  const pct = max > 0 ? (wrap.scrollLeft / max) * 100 : 0;
  progressPct.value = pct;
  currentStep.value = Math.min(Math.round((pct / 100) * (cards.value.length - 1)), cards.value.length - 1);
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
  position: relative;
}

.differentiator::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 60% 70% at 10% 60%, rgba(44, 119, 250, 0.22) 0%, transparent 65%),
    radial-gradient(ellipse 50% 60% at 90% 30%, rgba(16, 212, 192, 0.18) 0%, transparent 60%),
    radial-gradient(ellipse 40% 50% at 55% 85%, rgba(124, 58, 237, 0.15) 0%, transparent 60%);
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
  position: relative;
  z-index: 1;
}

.process-track-wrap::-webkit-scrollbar { display: none; }
.process-track-wrap.grabbing { cursor: grabbing; }

.process-track {
  display: flex;
  align-items: stretch;
  gap: 16px;
  width: max-content;
  margin: 0 auto;
  padding-bottom: 40px;
}

.process-card {
  width: 340px;
  background: linear-gradient(
    160deg,
    rgba(30, 65, 140, 0.55) 0%,
    rgba(15, 35, 85, 0.65) 60%,
    rgba(8, 20, 55, 0.7) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.09);
  border-radius: 20px;
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-shrink: 0;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.4s ease,
              opacity 0.5s ease,
              border-color 0.3s;
  opacity: 0;
  transform: translateY(80px) scale(0.88);
  position: relative;
  overflow: hidden;
}

/* Shimmer sweep on hover */
.process-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 20%,
    rgba(255, 255, 255, 0.05) 35%,
    rgba(255, 255, 255, 0.09) 45%,
    rgba(255, 255, 255, 0.05) 55%,
    transparent 80%
  );
  border-radius: 20px;
  transform: translateX(-120%);
  z-index: 0;
  pointer-events: none;
}

.process-card:hover::before {
  animation: shineWipe 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Top accent gradient line */
.process-card::after {
  content: '';
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
  opacity: 0.45;
  transition: opacity 0.3s, left 0.3s, right 0.3s;
}

.process-card:hover::after {
  opacity: 1;
  left: 0; right: 0;
}

.process-card:hover {
  transform: scale(1.05) translateY(-8px) !important;
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 0 50px rgba(44, 119, 250, 0.1);
  border-color: rgba(255, 255, 255, 0.14);
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
  opacity: 0.3;
  transform: scale(0.96) !important;
}

/* Final card — brighter teal glass */
.process-card-final {
  background: linear-gradient(
    160deg,
    rgba(16, 212, 192, 0.13) 0%,
    rgba(44, 119, 250, 0.07) 60%,
    rgba(0, 0, 0, 0.04) 100%
  ) !important;
  border-color: rgba(16, 212, 192, 0.18) !important;
}

.process-card-final:hover {
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(16, 212, 192, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 0 60px rgba(16, 212, 192, 0.12) !important;
}

.pc-num {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--card-accent);
  opacity: 0.75;
  font-family: 'Outfit', sans-serif;
}

.pc-icon {
  width: 72px;
  height: 72px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: var(--card-accent);
  background: rgba(255, 255, 255, 0.03);
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

.process-card:hover .pc-icon {
  transform: scale(1.06);
  border-color: var(--card-accent);
  box-shadow: 0 0 24px rgba(44, 119, 250, 0.2);
}

.pc-title {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 14px;
  line-height: 1.2;
  font-family: 'Outfit', sans-serif;
}

.pc-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.52);
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
  color: rgba(255, 255, 255, 0.38);
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Outfit', sans-serif;
}

.pc-details li i { color: var(--card-accent); font-size: 13px; flex-shrink: 0; }

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
  background: linear-gradient(90deg, #2c77fa, #7c3aed, #10d4c0);
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
