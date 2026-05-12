<template>
  <section class="cta-section" ref="sectionEl">
    <canvas class="cta-canvas" ref="canvasEl"></canvas>
    <div class="cta-overlay"></div>
    <div class="cnt">
      <div class="cta-block">
        <p class="sec-label">{{ t('cta.label') }}</p>
        <h2 class="cta-h2">{{ t('cta.heading') }}</h2>
        <p class="cta-sub">{{ t('cta.sub') }}</p>
        <RouterLink to="/despre-noi#contact" class="btn-outline">{{ t('cta.btn') }} <span style="margin-left:8px">›</span></RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../useI18n.js';
import * as THREE from 'three';

const { t } = useI18n();

const sectionEl = ref(null);
const canvasEl  = ref(null);

let renderer = null;
let camera   = null;
let animId   = null;
let angle    = 0;
let io       = null;
let isVisible    = false;
let isTabVisible = true;

function shouldRender() { return isVisible && isTabVisible && renderer; }
function onVisibilityChange() {
  isTabVisible = document.visibilityState === 'visible';
  scheduleTick();
}
function scheduleTick() {
  if (animId == null && shouldRender()) animId = requestAnimationFrame(tick);
}

function getScene() {
  return window.__chScene || null;
}

function initRenderer() {
  if (renderer) return;
  const scene = getScene();
  if (!scene) return;

  try {
    const canvas = canvasEl.value;
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setClearColor(0x031739, 1);

    camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
    camera.position.set(3, 0.8, 2.5);
    camera.lookAt(0, 0, 0);

    resize();
    scheduleTick();
  } catch (e) {
    renderer = null;
  }
}

function resize() {
  if (!renderer || !canvasEl.value) return;
  const canvas = canvasEl.value;
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight || 600;
  renderer.setSize(w, h, false);
  if (camera) { camera.aspect = w / h; camera.updateProjectionMatrix(); }
}

function tick() {
  animId = null;
  const scene = getScene();
  if (!shouldRender() || !scene) return;
  angle += 0.0015;
  const r = 2.5;
  camera.position.set(Math.sin(angle) * r, 0.8, Math.cos(angle) * r);
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
  animId = requestAnimationFrame(tick);
}

onMounted(() => {
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  io = new IntersectionObserver(entries => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !renderer) initRenderer();
    else scheduleTick();
  }, { threshold: 0.05 });
  io.observe(sectionEl.value);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  document.removeEventListener('visibilitychange', onVisibilityChange);
  if (animId != null) cancelAnimationFrame(animId);
  animId = null;
  if (renderer) renderer.dispose();
  if (io) io.disconnect();
});
</script>

<style scoped>
.cta-section {
  padding: 140px 0;
  background: #031739;
  position: relative;
  overflow: hidden;
  min-height: 600px;
}

.cta-canvas {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  opacity: 0.65;
  display: block;
}

.cta-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 100% at 50% 50%, rgba(3,23,57,0.5) 0%, rgba(3,23,57,0.85) 100%);
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
  max-width: 680px;
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
</style>
