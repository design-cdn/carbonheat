<template>
  <section class="projects">
    <div class="cnt proj-top">
      <div>
        <p class="sec-label">{{ t(prefix + '.label') }}</p>
        <h2 class="sec-h2">{{ t(prefix + '.heading') }}</h2>
      </div>
    </div>

    <div class="proj-track-wrap" ref="trackWrapEl">
      <div class="proj-track">
        <div
          v-for="(proj, i) in effectiveProjects"
          :key="i"
          class="proj-slide"
          :class="{ revealed: revealedSlides[i] }"
          :ref="el => slideRefs[i] = el"
        >
          <div
            class="proj-slide-img"
            :style="{ backgroundImage: `url(${proj.img})` }"
            @click="openLightbox(i, 0)"
          ></div>
          <div class="proj-slide-overlay" @click="openLightbox(i, 0)">
            <div class="proj-slide-loc"><i class="ph ph-map-pin"></i> {{ proj.loc }}</div>
            <div class="proj-slide-name" v-html="proj.name"></div>
            <div class="proj-slide-desc">{{ proj.desc }}</div>
            <div class="proj-gallery-hint"><i class="ph ph-images"></i> {{ proj.gallery.length }} foto</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Teleport to="body">
    <div v-if="lightbox.open" class="lb-overlay" @click.self="closeLightbox">
      <button class="lb-close" @click="closeLightbox"><i class="ph ph-x"></i></button>

      <button v-if="lightbox.photoIndex > 0" class="lb-arrow lb-prev" @click="prevPhoto">
        <i class="ph ph-caret-left"></i>
      </button>
      <button v-if="lightbox.photoIndex < currentGallery.length - 1" class="lb-arrow lb-next" @click="nextPhoto">
        <i class="ph ph-caret-right"></i>
      </button>

      <div class="lb-img-wrap">
        <img :src="currentPhoto" :key="currentPhoto" class="lb-img" />
      </div>

      <div class="lb-counter">{{ lightbox.photoIndex + 1 }} / {{ currentGallery.length }}</div>

      <div class="lb-thumbs">
        <div
          v-for="(photo, j) in currentGallery"
          :key="j"
          class="lb-thumb"
          :class="{ active: j === lightbox.photoIndex }"
          :style="{ backgroundImage: `url(${photo})` }"
          @click="lightbox.photoIndex = j"
        ></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../useI18n.js';

const { t } = useI18n();

const props = defineProps({
  prefix:   { type: String, default: 'projects' },
  projects: { type: Array, default: () => [] },
});

const { prefix } = props;

const effectiveProjects = computed(() => {
  if (props.projects.length > 0) return props.projects;
  return [
    {
      img:  '/assets/images/projects/proj1-1.jpg',
      gallery: [
        '/assets/images/projects/proj1-1.jpg',
        '/assets/images/projects/proj1-2.jpg',
        '/assets/images/projects/proj1-3.jpg',
        '/assets/images/projects/proj1-4.jpg',
      ],
      loc:  'Jud. Ilfov',
      name: t('home.proj0.name'),
      desc: t('home.proj0.desc'),
    },
    {
      img:  '/assets/images/projects/proj2-1.jpg',
      gallery: [
        '/assets/images/projects/proj2-1.jpg',
        '/assets/images/projects/proj2-2.jpg',
        '/assets/images/projects/proj2-3.jpg',
        '/assets/images/projects/proj2-4.jpg',
      ],
      loc:  'Jud. Brașov',
      name: t('home.proj1.name'),
      desc: t('home.proj1.desc'),
    },
    {
      img:  '/assets/images/projects/proj3-1.jpg',
      gallery: [
        '/assets/images/projects/proj3-1.jpg',
        '/assets/images/projects/proj3-2.jpg',
        '/assets/images/projects/proj3-3.jpg',
        '/assets/images/projects/proj3-4.jpg',
      ],
      loc:  'București',
      name: t('home.proj2.name'),
      desc: t('home.proj2.desc'),
    },
  ];
});

const trackWrapEl  = ref(null);
const slideRefs    = reactive([]);
const revealedSlides = reactive({});

const lightbox = reactive({ open: false, projectIndex: -1, photoIndex: 0 });

const currentGallery = computed(() =>
  lightbox.projectIndex >= 0 ? effectiveProjects.value[lightbox.projectIndex].gallery : []
);
const currentPhoto = computed(() => currentGallery.value[lightbox.photoIndex] ?? '');

function openLightbox(projIdx, photoIdx) {
  lightbox.projectIndex = projIdx;
  lightbox.photoIndex   = photoIdx;
  lightbox.open = true;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.open = false;
  document.body.style.overflow = '';
}

function nextPhoto() {
  if (lightbox.photoIndex < currentGallery.value.length - 1) lightbox.photoIndex++;
}

function prevPhoto() {
  if (lightbox.photoIndex > 0) lightbox.photoIndex--;
}

function onKeydown(e) {
  if (!lightbox.open) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') nextPhoto();
  if (e.key === 'ArrowLeft')  prevPhoto();
}

let io = null;
let isDown = false, startX = 0, scrollLeft = 0;

function onMouseDown(e) {
  isDown = true;
  trackWrapEl.value.classList.add('grabbing');
  startX = e.pageX - trackWrapEl.value.offsetLeft;
  scrollLeft = trackWrapEl.value.scrollLeft;
}
function onMouseLeave() { isDown = false; trackWrapEl.value.classList.remove('grabbing'); }
function onMouseUp()    { isDown = false; trackWrapEl.value.classList.remove('grabbing'); }
function onMouseMove(e) {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - trackWrapEl.value.offsetLeft;
  trackWrapEl.value.scrollLeft = scrollLeft - (x - startX) * 1.2;
}

onMounted(() => {
  const wrap = trackWrapEl.value;
  wrap.addEventListener('mousedown', onMouseDown);
  wrap.addEventListener('mouseleave', onMouseLeave);
  wrap.addEventListener('mouseup', onMouseUp);
  wrap.addEventListener('mousemove', onMouseMove);
  window.addEventListener('keydown', onKeydown);

  io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = slideRefs.indexOf(entry.target);
        if (idx >= 0) setTimeout(() => { revealedSlides[idx] = true; }, idx * 100);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  slideRefs.forEach(el => { if (el) io.observe(el); });
});

onUnmounted(() => {
  const wrap = trackWrapEl.value;
  if (wrap) {
    wrap.removeEventListener('mousedown', onMouseDown);
    wrap.removeEventListener('mouseleave', onMouseLeave);
    wrap.removeEventListener('mouseup', onMouseUp);
    wrap.removeEventListener('mousemove', onMouseMove);
  }
  window.removeEventListener('keydown', onKeydown);
  if (io) io.disconnect();
  document.body.style.overflow = '';
});
</script>

<style scoped>
.projects {
  padding: 140px 0 80px;
  overflow: hidden;
}

.cnt {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 56px;
}

.proj-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 56px;
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
  margin-bottom: 0;
  font-family: 'Outfit', sans-serif;
}

.proj-track-wrap {
  overflow-x: auto;
  overflow-y: visible;
  padding: 0 56px 48px;
  cursor: grab;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.proj-track-wrap::-webkit-scrollbar { display: none; }
.proj-track-wrap.grabbing { cursor: grabbing; }

.proj-track {
  display: flex;
  gap: 20px;
  width: max-content;
  margin: 0 auto;
}

.proj-slide {
  width: 720px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(40px);
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.proj-slide.revealed { opacity: 1; transform: translateX(0); }
.proj-slide:hover .proj-slide-img { transform: scale(1.04); }

.proj-slide-img {
  height: 580px;
  width: 100%;
  display: block;
  background-size: cover;
  background-position: center;
  background-color: #0a1628;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: zoom-in;
}

.proj-slide-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 80px 36px 36px;
  background: linear-gradient(to top, rgba(3,23,57,0.95) 0%, rgba(3,23,57,0.6) 60%, transparent 100%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: zoom-in;
}

.proj-slide-loc {
  font-size: 14px;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  font-family: 'Outfit', sans-serif;
}

.proj-slide-loc i { font-size: 16px; color: #2c77fa; }

.proj-slide-name {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.025em;
  line-height: 1.15;
  font-family: 'Outfit', sans-serif;
}

.proj-slide-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.65;
  font-weight: 300;
  font-family: 'Outfit', sans-serif;
}

.proj-gallery-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.05em;
  font-family: 'Outfit', sans-serif;
  margin-top: 4px;
}

.proj-gallery-hint i { font-size: 14px; }

/* Lightbox */
.lb-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px 120px;
  backdrop-filter: blur(8px);
}

.lb-close {
  position: absolute;
  top: 20px; right: 24px;
  background: none;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.lb-close:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.5); }

.lb-arrow {
  position: absolute;
  top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 50%;
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  transition: background 0.2s;
}
.lb-arrow:hover { background: rgba(255,255,255,0.18); }
.lb-prev { left: 20px; }
.lb-next { right: 20px; }

.lb-img-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 0;
}

.lb-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
  animation: lbFadeIn 0.2s ease;
}

@keyframes lbFadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }

.lb-counter {
  position: absolute;
  top: 24px; left: 50%; transform: translateX(-50%);
  font-size: 13px;
  color: rgba(255,255,255,0.45);
  font-family: 'Outfit', sans-serif;
  letter-spacing: 0.1em;
}

.lb-thumbs {
  position: absolute;
  bottom: 20px;
  display: flex;
  gap: 8px;
}

.lb-thumb {
  width: 64px;
  height: 48px;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  opacity: 0.45;
  border: 2px solid transparent;
  transition: opacity 0.2s, border-color 0.2s;
}

.lb-thumb:hover { opacity: 0.75; }
.lb-thumb.active { opacity: 1; border-color: #2c77fa; }

@media (max-width: 640px) {
  .cnt { padding: 0 24px; }
  .proj-slide { width: 320px; }
  .proj-slide-img { height: 320px; }
  .lb-arrow { display: none; }
}
</style>
