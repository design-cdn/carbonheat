<template>
  <div class="page-solar">
    <AppNav />
    <HeroPage prefix="solar.hero" videoSrc="/assets/video/bg1.mp4" />

    <SectionFeatures prefix="solar.features" bgFade />

    <SectionMegaStat
      eyebrow="Capacitate instalată"
      :intMain="10"
      decimal=".9"
      unit="MW"
      :label="t('solar.megastat.label')"
      :sub="t('solar.megastat.sub')"
      :clients="solarClients"
    />

    <SectionSpecializations
      prefix="solar.spec"
      :stat1Num="11"
      :stat2Num="'10.9'"
      :cols="solarCols"
      :partnerCols="[]"
    />

    <SectionProjects
      prefix="solar.projects"
      :projects="solarProjects"
    />

    <SectionCtaSimple prefix="solar.cta" />

    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from '../useI18n.js';
import AppNav                 from '../components/AppNav.vue';
import HeroPage               from '../components/HeroPage.vue';
import SectionFeatures        from '../components/SectionFeatures.vue';
import SectionMegaStat        from '../components/SectionMegaStat.vue';
import SectionSpecializations from '../components/SectionSpecializations.vue';
import SectionProjects        from '../components/SectionProjects.vue';
import SectionCtaSimple       from '../components/SectionCtaSimple.vue';
import AppFooter              from '../components/AppFooter.vue';

const { t } = useI18n();

const solarClients = [
  'Antibiotice Iași',
  'Unilever Romania',
  'Prysmian Slatina',
  'Oechsler Romania',
  'ITIM Cluj',
  'CTPark București',
  'AD-PHARMA Mogoșoaia',
];

const solarCols = computed(() => [
  { icon: 'ph-solar-panel', accent: '#2c77fa', name: t('solar.col0.name'), desc: t('solar.col0.desc') },
  { icon: 'ph-lightning',   accent: '#10d4c0', name: t('solar.col1.name'), desc: t('solar.col1.desc') },
  { icon: 'ph-gear-fine',   accent: '#fb923c', name: t('solar.col2.name'), desc: t('solar.col2.desc') },
]);

// 3 proiecte reprezentative din cele 11 (cele mai notabile / capacitate mare).
// Foto: placeholder din Hale Industriale — clientul va trimite 3 imagini reale.
const solarProjects = computed(() => [
  {
    img:  '/assets/images/projects/proj1-1.jpg',
    gallery: [
      '/assets/images/projects/proj1-1.jpg',
      '/assets/images/projects/proj1-2.jpg',
      '/assets/images/projects/proj1-3.jpg',
      '/assets/images/projects/proj1-4.jpg',
    ],
    loc:  'Iași',
    name: t('solar.proj0.name'),
    desc: t('solar.proj0.desc'),
  },
  {
    img:  '/assets/images/projects/proj2-1.jpg',
    gallery: [
      '/assets/images/projects/proj2-1.jpg',
      '/assets/images/projects/proj2-2.jpg',
      '/assets/images/projects/proj2-3.jpg',
      '/assets/images/projects/proj2-4.jpg',
    ],
    loc:  'București',
    name: t('solar.proj1.name'),
    desc: t('solar.proj1.desc'),
  },
  {
    img:  '/assets/images/projects/proj3-1.jpg',
    gallery: [
      '/assets/images/projects/proj3-1.jpg',
      '/assets/images/projects/proj3-2.jpg',
      '/assets/images/projects/proj3-3.jpg',
      '/assets/images/projects/proj3-4.jpg',
    ],
    loc:  'România',
    name: t('solar.proj2.name'),
    desc: t('solar.proj2.desc'),
  },
]);
</script>

<style>
/* Global pe pagina Fotovoltaice */
html, body {
  background: #031739;
  color: #d8eaf6;
  font-family: 'Outfit', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(20,80,140,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(20,80,140,0.035) 1px, transparent 1px);
  background-size: 56px 56px;
}
</style>

<style scoped>
.page-solar {
  background: #031739;
  position: relative;
}
</style>
