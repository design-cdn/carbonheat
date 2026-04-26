<template>
  <section class="hero">
    <canvas ref="canvasEl" id="three-canvas"></canvas>

    <!-- Radial gradient backdrop for text readability -->
    <div class="text-backdrop" id="text-backdrop" style="opacity:0"></div>

    <!-- Centered text at top — same as prototype -->
    <div class="hero-text" id="hero-text" style="opacity:0">
      <p class="overline">{{ t('hero.overline') }}</p>
      <h1 class="headline">
        <span>{{ t('hero.headline1') }}</span>
        <em>{{ t('hero.headline2') }}</em>
      </h1>
      <HeroTimeline :active-sys="activeSys" />
    </div>

    <!-- Bottom progress bar + milestone dots -->
    <div class="prog-wrap" id="prog-wrap" style="opacity:0">
      <div class="prog-track">
        <div class="prog-fill" id="prog-fill"></div>
      </div>
      <div class="milestones" id="milestones">
        <div
          v-for="(sys, i) in SYSTEMS"
          :key="i"
          class="ms"
          :class="{
            active:    activeSys === i,
            done:      activeSys > i && activeSys < SYSTEMS.length,
            'all-done': activeSys >= SYSTEMS.length,
          }"
          :style="{
            '--mc': '#' + sys.color.toString(16).padStart(6, '0'),
            left: [0, 25, 50, 75, 100][i] + '%',
            ...(i === 0 ? { transform: 'translateX(0)' } : i === 4 ? { transform: 'translateX(-100%)' } : {}),
          }"
        >
          <div class="ms-dot"></div>
          <div class="ms-lbl">{{ abbrs[locale][i] }}</div>
        </div>
      </div>
    </div>

    <div v-if="loadError" class="load-error">
      Model lipsă — copiați <code>factory.glb</code> în <code>public/assets/models/</code>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { useThreeScene } from '../composables/useThreeScene.js';
import { useMepSystems, SYSTEMS } from '../composables/useMepSystems.js';
import { useIntroAnimation } from '../composables/useIntroAnimation.js';
import { useI18n } from '../useI18n.js';
import HeroTimeline from './HeroTimeline.vue';

const { t, locale } = useI18n();

const canvasEl  = ref(null);
const activeSys = ref(-1);
const loadError = ref(false);

const abbrs = {
  ro: ['ELECTRIC', 'HVAC', 'SANITAR', 'INCENDIU', 'BMS'],
  en: ['ELECTRIC', 'HVAC', 'SANITARY', 'FIRE',    'BMS'],
};

let scene3    = null;
let mep       = null;
let intro     = null;
let edgeLines = [];

onMounted(async () => {
  scene3 = useThreeScene();
  mep    = useMepSystems();

  let loadResult;
  try {
    loadResult = await scene3.init(canvasEl.value);
  } catch (e) {
    console.error('GLB load error:', e);
    loadError.value = true;
    return;
  }

  const { grp, buildingInfo, startPos, lookTarget } = loadResult;

  // Edge wireframe — added as siblings of each mesh (same parent) to inherit transforms
  buildEdges(grp);

  // MEP geometry — built in world space using ZONE_DEFAULTS
  // The model is NOT scaled, so zone coords match naturally
  mep.build(scene3.getScene());

  // End position from prototype (elevated view after 360° spin)
  const endPos = new THREE.Vector3(0.5, 5.2, -15.5);

  intro = useIntroAnimation({
    getCamera:   scene3.getCamera,
    getControls: scene3.getControls,
    sysGroups:   mep.sysGroups,
    edgeLines,
  });

  intro.setPositions(startPos, endPos, lookTarget);
  intro.setCallbacks({ onActive: (i) => { activeSys.value = i; } });

  const edgeMats = edgeLines.map(ls => ls.material);
  intro.startIntro(edgeMats);
});

onUnmounted(() => {
  if (intro)  intro.killTimelines();
  if (mep)    mep.dispose(scene3?.getScene());
  if (scene3) scene3.destroy();
  edgeLines = [];
});

function buildEdges(grp) {
  grp.traverse(obj => {
    if (obj.isMesh && obj.geometry && obj.name !== 'Object_2') {
      obj.updateWorldMatrix(true, false);
      const edges = new THREE.EdgesGeometry(obj.geometry, 12);
      const mat   = new THREE.LineBasicMaterial({
        color: 0xd8eaf6,
        transparent: true,
        opacity: 0,
      });
      const ls = new THREE.LineSegments(edges, mat);
      ls.applyMatrix4(obj.matrixWorld);
      scene3.getScene().add(ls);
      edgeLines.push(ls);
    }
  });
}
</script>

<style scoped>
.hero {
  height: 100vh;
  position: relative;
  overflow: hidden;
}

#three-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.text-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  z-index: 5;
  background: radial-gradient(ellipse 80% 100% at 50% 0%, rgba(2,13,26,0.88) 25%, transparent 100%);
  pointer-events: none;
}

.hero-text {
  position: absolute;
  top: 52px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 100%;
  max-width: 1100px;
  text-align: center;
  padding: 0 48px;
}

.overline {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #2888f0;
  margin-bottom: 16px;
  font-family: 'Outfit', sans-serif;
}

.headline {
  font-size: clamp(32px, 5vw, 80px);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.03em;
  font-family: 'Outfit', sans-serif;
  color: #d8eaf6;
  margin: 0;
}

.headline em {
  display: block;
  font-style: normal;
  font-weight: 700;
  color: #d8eaf6;
}

/* ── Bottom progress bar ───────────────────── */
.prog-wrap {
  position: absolute;
  bottom: 28px;
  left: 48px;
  right: 52px;
  z-index: 20;
  pointer-events: none;
}

.prog-track {
  height: 2px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 2px;
  position: relative;
}

.prog-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0%;
  border-radius: 2px;
  background: #f07828;
  transition: none;
}

.milestones {
  position: relative;
  height: 42px;
  margin-top: 0;
}

.ms {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

.ms:first-child { align-items: flex-start; }
.ms:last-child  { align-items: flex-end; }

.ms-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.11);
  margin-top: -4.5px;
  flex-shrink: 0;
  transition: background 0.4s, box-shadow 0.4s, transform 0.3s;
}

.ms.active .ms-dot   { background: var(--mc); box-shadow: 0 0 14px var(--mc); transform: scale(1.6); }
.ms.done .ms-dot     { background: var(--mc); opacity: 0.55; transform: scale(1.2); }
.ms.all-done .ms-dot { background: var(--mc); opacity: 0.8; transform: scale(1.3); }

.ms-lbl {
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0);
  white-space: nowrap;
  margin-top: 8px;
  font-family: 'Outfit', sans-serif;
  transition: color 0.5s ease;
}

.ms.active .ms-lbl   { color: #d8eaf6; }
.ms.done .ms-lbl     { color: rgba(255, 255, 255, 0.45); }
.ms.all-done .ms-lbl { color: rgba(255, 255, 255, 0.55); }

.load-error {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(232, 48, 48, 0.12);
  border: 1px solid rgba(232, 48, 48, 0.4);
  color: #e83030;
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
}
</style>
