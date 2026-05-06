<template>
  <section class="hero">
    <canvas ref="canvasEl" id="three-canvas"></canvas>

    <!-- Radial gradient backdrop for text readability -->
    <div class="text-backdrop" id="text-backdrop" style="opacity:0"></div>

    <!-- Centered text -->
    <div class="hero-text" id="hero-text" style="opacity:0">
      <h1 class="headline">
        <span>{{ t('hero.headline1') }}</span>
        <em>{{ t('hero.headline2') }}</em>
      </h1>
      <HeroTimeline :active-sys="activeSys" />
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

const { t } = useI18n();

const canvasEl  = ref(null);
const activeSys = ref(-1);
const loadError = ref(false);

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

  // Expose scene for CTA canvas to share the same scene
  window.__chScene = scene3.getScene();

  buildEdges(grp);
  mep.build(scene3.getScene());

  const endPos = new THREE.Vector3(0, 5.2, -15.5);

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
  window.__chScene = null;
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
}

#three-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  transform: translateY(160px);
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
  top: 140px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: min(80%, 1312px);
  text-align: center;
}

.headline {
  padding: 0 56px;
  font-size: clamp(32px, 5vw, 80px);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.03em;
  font-family: 'Outfit', sans-serif;
  color: #fff;
  margin: 0;
}

.headline span { color: #fff; }

.headline em {
  display: inline;
  font-style: normal;
  font-weight: 700;
  color: #2c77fa;
}

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
