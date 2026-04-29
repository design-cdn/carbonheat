<template>
  <section class="projects">
    <div class="cnt proj-top">
      <div>
        <p class="sec-label">{{ t('projects.label') }}</p>
        <h2 class="sec-h2">{{ t('projects.heading') }}</h2>
      </div>
      <a href="#" class="btn-outline">{{ t('projects.viewAll') }} <span style="margin-left:6px">›</span></a>
    </div>

    <div class="proj-track-wrap" ref="trackWrapEl">
      <div class="proj-track">
        <div
          v-for="(proj, i) in projects"
          :key="i"
          class="proj-slide"
          :class="{ revealed: revealedSlides[i] }"
          :ref="el => slideRefs[i] = el"
        >
          <div class="proj-slide-img" :style="{ backgroundImage: `url(${proj.img})` }"></div>
          <div class="proj-slide-overlay">
            <div class="proj-slide-loc"><i class="ph ph-map-pin"></i> {{ proj.loc }}</div>
            <div class="proj-slide-name" v-html="proj.name"></div>
            <div class="proj-slide-desc">{{ proj.desc }}</div>
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

const trackWrapEl  = ref(null);
const slideRefs    = reactive([]);
const revealedSlides = reactive({});

const projects = [
  {
    img:  '/assets/images/1.jpg',
    loc:  'Jud. Ilfov',
    name: 'Hală logistică<br/>14.000 mp',
    desc: 'Echipare completă — toate cele 11 sisteme, coordonare cu antreprenorul general și recepție fără observații.',
  },
  {
    img:  '/assets/images/2.jpg',
    loc:  'Jud. Cluj',
    name: 'Hală producție<br/>Sector automotive',
    desc: 'Instalații VAC și BMS pentru linie de producție cu cerințe stricte de temperatură și umiditate relativă.',
  },
  {
    img:  '/assets/images/3.jpg',
    loc:  'Jud. Timiș',
    name: 'Parc industrial<br/>3 hale, faze succesive',
    desc: 'Coordonare multi-fază pentru echiparea a trei hale cu infrastructură electrică și de siguranță comună.',
  },
];

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
  if (io) io.disconnect();
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

.btn-outline {
  display: inline-flex;
  align-items: center;
  padding: 11px 26px;
  border: 1px solid rgba(44, 119, 250, 0.5);
  color: rgba(44, 119, 250, 0.9);
  font: 500 13px/1 'Outfit', sans-serif;
  text-decoration: none;
  border-radius: 50px;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  white-space: nowrap;
}

.btn-outline:hover {
  border-color: rgba(44, 119, 250, 0.9);
  color: #fff;
  background: rgba(44, 119, 250, 0.1);
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
}

.proj-slide-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 80px 36px 36px;
  background: linear-gradient(to top, rgba(3,23,57,0.95) 0%, rgba(3,23,57,0.6) 60%, transparent 100%);
  display: flex;
  flex-direction: column;
  gap: 10px;
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

@media (max-width: 640px) {
  .cnt { padding: 0 24px; }
  .proj-slide { width: 320px; }
  .proj-slide-img { height: 320px; }
}
</style>
