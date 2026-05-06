<template>
  <section class="specializations" ref="sectionEl">
    <canvas class="spec-bg-canvas" ref="canvasEl"></canvas>
    <div class="spec-content">
      <div class="cnt spec-header">
        <div class="spec-header-left">
          <p class="sec-label">{{ t(prefix + '.label') }}</p>
          <h2 class="spec-big-h" v-html="t(prefix + '.heading')"></h2>
        </div>
        <div class="spec-header-right">
          <p class="spec-intro">{{ t(prefix + '.intro') }}</p>
          <div class="spec-stat-row">
            <div class="spec-stat">
              <span class="spec-stat-num">{{ stat1Num }}</span>
              <span class="spec-stat-label">{{ t(prefix + '.stat1') }}</span>
            </div>
            <div class="spec-stat">
              <span class="spec-stat-num">{{ stat2Num }}</span>
              <span class="spec-stat-label">{{ t(prefix + '.stat2') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="spec-cols-wrap" :class="{ 'spec-cols-wrap-3': effectiveCols.length === 3 }">
        <div class="spec-cols" :class="{ 'spec-cols-3': effectiveCols.length === 3 }">
          <div
            v-for="(col, i) in effectiveCols"
            :key="i"
            class="spec-col"
            :class="{ revealed: revealedCols[i] }"
            :style="{ '--card-accent': col.accent }"
            :ref="el => colRefs[i] = el"
          >
            <div class="spec-col-icon-circle"><i :class="'ph ' + col.icon"></i></div>
            <div class="spec-col-name">{{ col.name }}</div>
            <div class="spec-col-desc">{{ col.desc }}</div>
          </div>
        </div>
      </div>

      <div v-if="effectivePartnerCols.length" class="spec-partner-wrap">
        <div class="cnt spec-partner-header">
          <h3 class="spec-partner-label">{{ effectivePartnerLabel }}</h3>
        </div>
        <div class="spec-cols-wrap spec-partner-cols-wrap">
          <div class="spec-cols spec-partner-cols">
            <div
              v-for="(col, i) in effectivePartnerCols"
              :key="i"
              class="spec-col spec-col-partner"
              :class="{ revealed: revealedCols[effectiveCols.length + i] }"
              :style="{ '--card-accent': col.accent }"
              :ref="el => colRefs[effectiveCols.length + i] = el"
            >
              <div class="spec-col-header">
                <div class="spec-col-icon-circle"><i :class="'ph ' + col.icon"></i></div>
                <div class="spec-col-name">{{ col.name }}</div>
              </div>
              <div class="spec-col-desc">{{ col.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../useI18n.js';

const { t } = useI18n();

const props = defineProps({
  prefix:       { type: String, default: 'spec' },
  stat1Num:     { type: [String, Number], default: 7 },
  stat2Num:     { type: [String, Number], default: 1 },
  cols:         { type: Array, default: () => [] },
  partnerCols:  { type: Array, default: () => null },
  partnerLabel: { type: String, default: '' },
});

const { prefix, stat1Num, stat2Num } = props;

const effectiveCols = computed(() => {
  if (props.cols.length > 0) return props.cols;
  return [
    { icon: 'ph-lightning',       accent: '#2c77fa', name: t('spec.col0.name'), desc: t('spec.col0.desc') },
    { icon: 'ph-fire',            accent: '#f43f5e', name: t('spec.col1.name'), desc: t('spec.col1.desc') },
    { icon: 'ph-wifi-high',       accent: '#8b5cf6', name: t('spec.col2.name'), desc: t('spec.col2.desc') },
    { icon: 'ph-cpu',             accent: '#0891b2', name: t('spec.col3.name'), desc: t('spec.col3.desc') },
  ];
});

const effectivePartnerCols = computed(() => {
  if (props.partnerCols === null) return [
    { icon: 'ph-drop',             accent: '#3b82f6', name: t('spec.partner0.name'), desc: t('spec.partner0.desc') },
    { icon: 'ph-wind',             accent: '#10d4c0', name: t('spec.partner1.name'), desc: t('spec.partner1.desc') },
    { icon: 'ph-fire-extinguisher',accent: '#fb923c', name: t('spec.partner2.name'), desc: t('spec.partner2.desc') },
  ];
  return props.partnerCols;
});

const effectivePartnerLabel = computed(() =>
  props.partnerLabel || t('spec.partnerLabel')
);

const sectionEl = ref(null);
const canvasEl  = ref(null);
const colRefs   = reactive([]);
const revealedCols = reactive({});

let animId = null;
let io = null;
let colIo = null;

function initCanvas() {
  const canvas = canvasEl.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, t = 0;
  let mouseX = 0.5, mouseY = 0.5;
  let targetX = 0.5, targetY = 0.5;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const section = sectionEl.value;
  section.addEventListener('mousemove', e => {
    const rect = section.getBoundingClientRect();
    targetX = (e.clientX - rect.left) / rect.width;
    targetY = (e.clientY - rect.top) / rect.height;
  });

  const blobs = [
    { x: 0.2, y: 0.3, r: 0.65, color: [26, 58, 200],  speed: 0.0006, ms: 0.38 },
    { x: 0.8, y: 0.7, r: 0.60, color: [2, 6, 18],     speed: 0.0004, ms: -0.28 },
    { x: 0.5, y: 0.1, r: 0.55, color: [44, 119, 250], speed: 0.0008, ms: 0.45 },
    { x: 0.1, y: 0.8, r: 0.50, color: [3, 8, 25],     speed: 0.0009, ms: -0.32 },
    { x: 0.9, y: 0.2, r: 0.58, color: [80, 30, 180],  speed: 0.0005, ms: 0.25 },
  ];

  let drawing = false;

  function draw() {
    animId = requestAnimationFrame(draw);
    t++;
    mouseX += (targetX - mouseX) * 0.12;
    mouseY += (targetY - mouseY) * 0.12;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#031739';
    ctx.fillRect(0, 0, w, h);
    blobs.forEach((b, i) => {
      const ox = Math.sin(t * b.speed + i * 1.3) * 0.12 + (mouseX - 0.5) * b.ms;
      const oy = Math.cos(t * b.speed * 0.7 + i * 0.9) * 0.10 + (mouseY - 0.5) * b.ms;
      const cx = (b.x + ox) * w;
      const cy = (b.y + oy) * h;
      const r  = b.r * Math.max(w, h);
      const [r1, g1, b1] = b.color;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,   `rgba(${r1},${g1},${b1},0.95)`);
      g.addColorStop(0.4, `rgba(${r1},${g1},${b1},0.5)`);
      g.addColorStop(1,   `rgba(${r1},${g1},${b1},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !drawing) { drawing = true; draw(); }
  }, { threshold: 0.05 });
  io.observe(section);
}

onMounted(() => {
  initCanvas();

  colIo = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = colRefs.indexOf(entry.target);
        if (idx >= 0) setTimeout(() => { revealedCols[idx] = true; }, idx * 120);
        colIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  colRefs.forEach(el => { if (el) colIo.observe(el); });
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
  if (io)     io.disconnect();
  if (colIo)  colIo.disconnect();
});
</script>

<style scoped>
.specializations {
  position: relative;
  padding: 140px 0 100px;
  background: #031739;
}

.spec-bg-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  z-index: 0;
}

.spec-content { position: relative; z-index: 2; }

.cnt {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 56px;
}

.spec-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: end;
  margin-bottom: 80px;
}

.sec-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 20px;
  font-family: 'Outfit', sans-serif;
}

.spec-big-h {
  font-size: clamp(52px, 7vw, 100px);
  font-weight: 800;
  line-height: 1.0;
  letter-spacing: -0.04em;
  color: #fff;
  margin: 0;
  font-family: 'Outfit', sans-serif;
}

.spec-intro {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.8;
  font-weight: 300;
  margin-bottom: 40px;
  font-family: 'Outfit', sans-serif;
}

.spec-stat-row {
  display: flex;
  gap: 48px;
}

.spec-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spec-stat-num {
  font-size: 42px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.04em;
  line-height: 1;
  font-family: 'Outfit', sans-serif;
}

.spec-stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: 'Outfit', sans-serif;
}

.spec-cols-wrap {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 56px 80px;
}

.spec-cols {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto 1fr;
  column-gap: 20px;
  row-gap: 24px;
  align-items: start;
}

.spec-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.spec-col {
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
  padding: 48px 36px 44px;
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
  align-items: start;
  opacity: 0;
  transform: translateY(80px) scale(0.88);
  transition: opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.4s ease,
              border-color 0.3s;
  position: relative;
  overflow: hidden;
}

/* Shimmer sweep on hover */
.spec-col::before {
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

.spec-col:hover::before {
  animation: specShine 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Top accent gradient line */
.spec-col::after {
  content: '';
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
  opacity: 0.45;
  transition: opacity 0.3s, left 0.3s, right 0.3s;
}

.spec-col:hover::after {
  opacity: 1;
  left: 0; right: 0;
}

.spec-col > * { position: relative; z-index: 1; }

.spec-col.revealed { opacity: 1; transform: translateY(0) scale(1); }

.spec-col:hover {
  transform: scale(1.04) translateY(-6px) !important;
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 0 50px color-mix(in srgb, var(--card-accent) 20%, transparent);
  border-color: rgba(255, 255, 255, 0.14);
  z-index: 10;
  opacity: 1 !important;
}

@keyframes specShine {
  0%   { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}

.spec-cols:has(.spec-col:hover) .spec-col:not(:hover) {
  opacity: 0.3;
  transform: scale(0.96) !important;
}

.spec-col-icon-circle {
  width: 72px;
  height: 72px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: var(--card-accent);
  background: rgba(255, 255, 255, 0.03);
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

.spec-col:hover .spec-col-icon-circle {
  transform: scale(1.06);
  border-color: var(--card-accent);
  box-shadow: 0 0 24px color-mix(in srgb, var(--card-accent) 40%, transparent);
}

.spec-col-name {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.15;
  font-family: 'Outfit', sans-serif;
}

.spec-col-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.7;
  font-weight: 300;
  font-family: 'Outfit', sans-serif;
}

.spec-partner-wrap {
  margin-top: 0;
}

.spec-partner-header {
  padding-top: 48px;
  padding-bottom: 0;
  margin-bottom: 0;
}

.spec-partner-label {
  font-size: clamp(32px, 3.5vw, 54px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: #fff;
  margin: 0 0 56px;
  font-family: 'Outfit', sans-serif;
}

.spec-partner-cols-wrap {
  padding-bottom: 100px;
}

.spec-partner-cols {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  row-gap: 20px;
}

.spec-col-partner {
  background: linear-gradient(
    160deg,
    rgba(16, 212, 192, 0.10) 0%,
    rgba(44, 119, 250, 0.05) 60%,
    rgba(0, 0, 0, 0.04) 100%
  ) !important;
  border-color: rgba(16, 212, 192, 0.16) !important;
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 2;
}

.spec-col-partner:hover {
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(16, 212, 192, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 0 60px rgba(16, 212, 192, 0.10) !important;
}

.spec-col-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.spec-col-header .spec-col-icon-circle {
  flex-shrink: 0;
}

.spec-col-partner .spec-col-name {
  font-size: 20px;
  font-weight: 700;
  flex: 1;
  min-width: 0;
}

@media (max-width: 1024px) {
  .spec-header { grid-template-columns: 1fr; gap: 40px; }
  .spec-cols   { grid-template-columns: 1fr 1fr; }
  .spec-partner-cols { grid-template-columns: 1fr 1fr 1fr; }
}

@media (max-width: 640px) {
  .cnt { padding: 0 24px; }
  .spec-cols { grid-template-columns: 1fr; }
  .spec-cols-wrap { padding: 0 24px 60px; }
  .spec-partner-cols { grid-template-columns: 1fr; }
}
</style>
