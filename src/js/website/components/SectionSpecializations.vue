<template>
  <section class="specializations" ref="sectionEl">
    <canvas class="spec-bg-canvas" ref="canvasEl"></canvas>
    <div class="spec-content">
      <div class="cnt spec-header">
        <div class="spec-header-left">
          <p class="sec-label">{{ t('spec.label') }}</p>
          <h2 class="spec-big-h" v-html="t('spec.heading')"></h2>
        </div>
        <div class="spec-header-right">
          <p class="spec-intro">{{ t('spec.intro') }}</p>
          <div class="spec-stat-row">
            <div class="spec-stat">
              <span class="spec-stat-num">11</span>
              <span class="spec-stat-label">{{ t('spec.stat1') }}</span>
            </div>
            <div class="spec-stat">
              <span class="spec-stat-num">1</span>
              <span class="spec-stat-label">{{ t('spec.stat2') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="spec-cols-wrap">
        <div class="spec-cols">
          <div
            v-for="(col, i) in cols"
            :key="i"
            class="spec-col"
            :class="{ revealed: revealedCols[i] }"
            :ref="el => colRefs[i] = el"
          >
            <div class="spec-col-header">
              <div class="spec-col-icon-circle"><i :class="'ph ' + col.icon"></i></div>
              <div class="spec-col-name">{{ col.name }}</div>
            </div>
            <ul class="spec-col-list">
              <li v-for="item in col.items" :key="item.label">
                <i :class="'ph ' + item.icon"></i> {{ item.label }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../useI18n.js';

const { t } = useI18n();

const sectionEl = ref(null);
const canvasEl  = ref(null);
const colRefs   = reactive([]);
const revealedCols = reactive({});

const cols = [
  {
    icon: 'ph-drop',
    name: 'Instalații utilitare',
    items: [
      { icon: 'ph-drop',        label: 'Sanitare' },
      { icon: 'ph-wind',        label: 'HVAC' },
      { icon: 'ph-thermometer', label: 'Termice' },
    ],
  },
  {
    icon: 'ph-fire-extinguisher',
    name: 'Siguranță',
    items: [
      { icon: 'ph-fire-extinguisher', label: 'Stingere incendiu' },
      { icon: 'ph-siren',             label: 'Detecție incendiu' },
    ],
  },
  {
    icon: 'ph-lightning',
    name: 'Electric',
    items: [
      { icon: 'ph-lightning', label: 'Curenți tari' },
      { icon: 'ph-cpu',       label: 'BMS' },
    ],
  },
  {
    icon: 'ph-wifi-high',
    name: 'Curent slab',
    items: [
      { icon: 'ph-wifi-high',      label: 'Voce-date' },
      { icon: 'ph-lock-key',       label: 'Control acces' },
      { icon: 'ph-shield-warning', label: 'Anti-efracție' },
      { icon: 'ph-camera',         label: 'CCTV' },
    ],
  },
];

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
        if (idx >= 0) revealedCols[idx] = true;
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
  gap: 1px;
  border-radius: 16px;
  overflow: visible;
}

.spec-col {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 48px 36px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
              background 0.3s,
              box-shadow 0.3s;
  position: relative;
}

.spec-col:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.spec-col.revealed { opacity: 1; transform: translateY(0); }
.spec-col:nth-child(1).revealed { transition-delay: 0ms; }
.spec-col:nth-child(2).revealed { transition-delay: 120ms; }
.spec-col:nth-child(3).revealed { transition-delay: 240ms; }
.spec-col:nth-child(4).revealed { transition-delay: 360ms; }

.spec-col:hover {
  background: rgba(5, 20, 50, 0.2);
  box-shadow: inset 0 0 60px rgba(16,212,192,0.08), 0 0 40px rgba(16,212,192,0.12);
}

.spec-col::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: rgba(16, 212, 192, 0);
  transition: background 0.3s;
}

.spec-col:hover::after { background: rgba(16, 212, 192, 0.7); }

.spec-col-header {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.spec-col-icon-circle {
  width: 72px;
  height: 72px;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
  margin: 0 0 28px;
  transition: border-color 0.3s, box-shadow 0.3s, color 0.3s;
}

.spec-col:hover .spec-col-icon-circle {
  border-color: #10d4c0;
  box-shadow: 0 0 32px rgba(16,212,192,0.6), 0 0 8px rgba(16,212,192,0.4), inset 0 0 20px rgba(16,212,192,0.12);
  color: #10d4c0;
}

.spec-col-name {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-family: 'Outfit', sans-serif;
}

.spec-col-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
}

.spec-col-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 400;
  color: #fff;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: color 0.2s;
  font-family: 'Outfit', sans-serif;
}

.spec-col-list li i {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
  transition: color 0.3s;
}

.spec-col:hover .spec-col-list li i { color: #10d4c0; }

@media (max-width: 1024px) {
  .spec-header { grid-template-columns: 1fr; gap: 40px; }
  .spec-cols   { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 640px) {
  .cnt { padding: 0 24px; }
  .spec-cols { grid-template-columns: 1fr; }
  .spec-cols-wrap { padding: 0 24px 60px; }
}
</style>
