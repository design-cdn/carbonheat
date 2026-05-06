<template>
  <section class="megastat" ref="sectionEl">
    <canvas class="megastat-bg" ref="canvasEl"></canvas>
    <div class="megastat-top-fade"></div>
    <div class="megastat-overlay"></div>

    <div class="megastat-content" :class="{ revealed }">
      <p v-if="eyebrow" class="megastat-eyebrow">{{ eyebrow }}</p>

      <div v-if="mode === 'number'" class="megastat-number">
        <span class="megastat-int">{{ displayInt }}</span><span
          class="megastat-decimal"
          :class="{ visible: decimalVisible }"
        >{{ decimal }}</span><span
          v-if="unit"
          class="megastat-unit"
          :class="{ visible: decimalVisible }"
        >{{ unit }}</span>
      </div>
      <div v-else class="megastat-bigtext-wrap" :class="{ compact }">
        <h2 class="megastat-bigtext" :class="{ compact }">{{ bigText }}</h2>
        <p v-if="smallText" class="megastat-smalltext">{{ smallText }}</p>
      </div>

      <p v-if="mode === 'number' && label" class="megastat-label">{{ label }}</p>
      <p v-if="mode === 'number' && sub" class="megastat-sub">{{ sub }}</p>
    </div>

    <div v-if="clients.length" class="megastat-marquee" aria-hidden="true">
      <div class="megastat-marquee-track">
        <span v-for="(c, i) in marqueeList" :key="i" class="megastat-marquee-item">
          {{ c }}<span class="megastat-marquee-sep">·</span>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  mode:      { type: String, default: 'number' }, // 'number' | 'text'
  eyebrow:   { type: String, default: '' },
  intMain:   { type: Number, default: 0 },
  decimal:   { type: String, default: '' },
  unit:      { type: String, default: '' },
  bigText:   { type: String, default: '' },
  smallText: { type: String, default: '' },
  compact:   { type: Boolean, default: false },
  label:     { type: String, default: '' },
  sub:       { type: String, default: '' },
  clients:   { type: Array, default: () => [] },
  duration:  { type: Number, default: 1600 },
});

const { mode, eyebrow, intMain, decimal, unit, bigText, smallText, compact, label, sub, clients, duration } = props;

// 4 copies for seamless loop on viewports up to ~5500px wide
const marqueeList = [...clients, ...clients, ...clients, ...clients];

const sectionEl = ref(null);
const canvasEl  = ref(null);
const displayInt = ref(0);
const decimalVisible = ref(false);
const revealed = ref(false);

let countRaf = null;
let bgRaf    = null;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function startCountUp() {
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutCubic(t);
    displayInt.value = Math.round(intMain * eased);
    if (t < 1) {
      countRaf = requestAnimationFrame(tick);
    } else {
      displayInt.value = intMain;
      // pop the decimal in after the integer settles
      setTimeout(() => { decimalVisible.value = true; }, 120);
    }
  };
  countRaf = requestAnimationFrame(tick);
}

function initBgCanvas() {
  const canvas = canvasEl.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, t = 0;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const blobs = [
    { x: 0.25, y: 0.40, r: 0.55, color: [44, 119, 250], speed: 0.0005, phase: 0   },
    { x: 0.75, y: 0.55, r: 0.50, color: [16, 212, 192], speed: 0.0004, phase: 1.5 },
    { x: 0.55, y: 0.20, r: 0.45, color: [80, 30, 180],  speed: 0.0006, phase: 3.0 },
    { x: 0.10, y: 0.75, r: 0.40, color: [12, 30, 80],   speed: 0.0003, phase: 4.5 },
  ];

  function draw() {
    bgRaf = requestAnimationFrame(draw);
    t++;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020d1a';
    ctx.fillRect(0, 0, w, h);
    blobs.forEach((b) => {
      const ox = Math.sin(t * b.speed + b.phase) * 0.10;
      const oy = Math.cos(t * b.speed * 0.8 + b.phase) * 0.08;
      const cx = (b.x + ox) * w;
      const cy = (b.y + oy) * h;
      const r  = b.r * Math.max(w, h);
      const [r1, g1, b1] = b.color;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,    `rgba(${r1},${g1},${b1},0.85)`);
      g.addColorStop(0.45, `rgba(${r1},${g1},${b1},0.35)`);
      g.addColorStop(1,    `rgba(${r1},${g1},${b1},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  draw();
}

function checkVisible() {
  if (revealed.value || !sectionEl.value) return;
  const rect = sectionEl.value.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
    revealed.value = true;
    if (mode === 'number') startCountUp();
    window.removeEventListener('scroll', checkVisible);
  }
}

onMounted(() => {
  initBgCanvas();
  checkVisible();
  window.addEventListener('scroll', checkVisible, { passive: true });
});

onUnmounted(() => {
  if (countRaf) cancelAnimationFrame(countRaf);
  if (bgRaf)    cancelAnimationFrame(bgRaf);
  window.removeEventListener('scroll', checkVisible);
});
</script>

<style scoped>
.megastat {
  position: relative;
  height: 80vh;
  min-height: 640px;
  background: #020d1a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.megastat-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
}

.megastat-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse 70% 80% at 50% 50%, rgba(2,13,26,0.4) 0%, rgba(2,13,26,0.78) 80%);
  pointer-events: none;
}

.megastat-top-fade {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 440px;
  z-index: 1;
  background: linear-gradient(180deg, #020d1a 0%, rgba(2,13,26,0.85) 30%, rgba(2,13,26,0.4) 65%, transparent 100%);
  pointer-events: none;
}

.megastat-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 32px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  max-width: 100%;
}
.megastat-content.revealed {
  opacity: 1;
  transform: translateY(0);
}

.megastat-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 32px;
  font-family: 'Outfit', sans-serif;
}

.megastat-number {
  display: inline-flex;
  align-items: flex-start;
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
  margin-bottom: 24px;
}

.megastat-int {
  font-size: clamp(180px, 40vh, 380px);
  background: linear-gradient(135deg, #2c77fa 0%, #6aa9ff 45%, #10d4c0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 8px 40px rgba(44, 119, 250, 0.25));
}

.megastat-decimal {
  display: inline-block;
  font-size: clamp(72px, 16vh, 152px);
  background: linear-gradient(135deg, #2c77fa 0%, #10d4c0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  margin-top: clamp(16px, 4vh, 36px);
  margin-left: 4px;
  padding-right: 0.08em;
  letter-spacing: 0;
  opacity: 0;
  transform: translateY(20px) scale(0.85);
  transition: opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.megastat-decimal.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.megastat-unit {
  font-size: clamp(180px, 40vh, 380px);
  background: linear-gradient(135deg, #2c77fa 0%, #6aa9ff 45%, #10d4c0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 8px 40px rgba(44, 119, 250, 0.25));
  margin-left: 0.18em;
  padding-right: 0.05em;
  letter-spacing: -0.04em;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s;
}
.megastat-unit.visible {
  opacity: 1;
  transform: translateY(0);
}

.megastat-label {
  font-size: clamp(56px, 9vh, 120px);
  font-weight: 500;
  letter-spacing: -0.025em;
  color: #fff;
  margin: 0 0 18px;
  font-family: 'Outfit', sans-serif;
  line-height: 1;
}

.megastat-bigtext-wrap {
  margin-bottom: 12px;
}

.megastat-bigtext {
  font-size: clamp(64px, 11vw, 180px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.08;
  margin: 0 0 18px;
  font-family: 'Outfit', sans-serif;
  background: linear-gradient(135deg, #2c77fa 0%, #6aa9ff 45%, #10d4c0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 8px 40px rgba(44, 119, 250, 0.25));
  padding: 0.05em 0.05em 0.25em;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
}

.megastat-bigtext.compact {
  font-size: clamp(28px, 4.5vw, 72px);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.18;
}

.megastat-smalltext {
  font-size: clamp(20px, 2.4vw, 36px);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.78);
  letter-spacing: -0.005em;
  line-height: 1.3;
  margin: 0;
  font-family: 'Outfit', sans-serif;
}

.megastat-sub {
  font-size: clamp(14px, 1.1vw, 16px);
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.04em;
  margin: 0;
  font-family: 'Outfit', sans-serif;
}

/* Marquee at bottom */
.megastat-marquee {
  position: absolute;
  bottom: 36px;
  left: 0;
  right: 0;
  z-index: 2;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
}

.megastat-marquee-track {
  display: inline-flex;
  white-space: nowrap;
  animation: megastatScroll 10s linear infinite;
}

@keyframes megastatScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-25%); }
}

.megastat-marquee-item {
  display: inline-flex;
  align-items: center;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
  font-family: 'Outfit', sans-serif;
}

.megastat-marquee-sep {
  margin: 0 32px;
  color: rgba(44, 119, 250, 0.85);
  font-weight: 700;
}

@media (max-width: 640px) {
  .megastat { height: auto; min-height: 480px; padding: 80px 0 100px; }
  .megastat-marquee { bottom: 24px; }
  .megastat-marquee-track { animation-duration: 8s; }
  .megastat-marquee-item { font-size: 14px; letter-spacing: 0.14em; }
  .megastat-marquee-sep { margin: 0 22px; }
  .megastat-content { padding: 0 16px; }
  .megastat-number { flex-wrap: wrap; justify-content: center; }
  .megastat-int { font-size: clamp(120px, 26vh, 200px); }
  .megastat-decimal { font-size: clamp(48px, 10vh, 80px); margin-top: clamp(6px, 1.5vh, 12px); }
  .megastat-unit {
    flex: 1 0 100%;
    font-size: clamp(120px, 26vh, 200px);
    margin-left: 0;
    margin-top: clamp(4px, 1vh, 12px);
    padding-right: 0;
    letter-spacing: -0.06em;
    text-align: center;
  }
  .megastat-label { font-size: clamp(40px, 9vh, 80px); }
}
</style>
