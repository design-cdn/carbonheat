<template>
  <div class="page-heavy">
    <AppNav />
    <HeroPage prefix="heavy.hero" videoSrc="/assets/video/bg3.mp4" />

    <SectionFeatures prefix="heavy.features" bgFade />

    <SectionMegaStat
      mode="text"
      :eyebrow="t('heavy.megastat.eyebrow')"
      :bigText="t('heavy.megastat.text')"
      :smallText="t('heavy.megastat.small')"
      :clients="heavyMarquee"
    />

    <SectionSpecializations
      prefix="heavy.spec"
      :stat1Num="3"
      :stat2Num="1"
      :cols="heavyCols"
      :partnerCols="[]"
    />

    <SectionProjects
      prefix="heavy.projects"
      :projects="heavyProjects"
    />

    <SectionCtaSimple
      prefix="heavy.cta"
      btnHref="mailto:office@carbonheat.ro?subject=Cerere%20ofertă%20infrastructură%20MT"
    />

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

// Marquee: autorizații + capacități tehnice MT (toate confirmate în PDF + spec)
const heavyMarquee = [
  'ANRE Tip B',
  'ISO 9001',
  'ISO 14001',
  'ISO 45001',
  'Posturi Trafo',
  'Rețele MT',
  'Tehnica conectare',
  'PRAM',
  'PIF',
  'Proiectare & Execuție',
];

const heavyCols = computed(() => [
  { icon: 'ph-warehouse',  accent: '#fb923c', name: t('heavy.col0.name'), desc: t('heavy.col0.desc') },
  { icon: 'ph-flow-arrow', accent: '#2c77fa', name: t('heavy.col1.name'), desc: t('heavy.col1.desc') },
  { icon: 'ph-plug',       accent: '#10d4c0', name: t('heavy.col2.name'), desc: t('heavy.col2.desc') },
]);

// 3 proiecte placeholder — același set foto ca Hale, texte tehnice MT-specific.
// TO REPLACE: clientul va trimite portofoliu MT real (în pregătire conform spec).
const heavyProjects = computed(() => [
  {
    img:  '/assets/images/projects/proj1-1.jpg',
    gallery: [
      '/assets/images/projects/proj1-1.jpg',
      '/assets/images/projects/proj1-2.jpg',
      '/assets/images/projects/proj1-3.jpg',
      '/assets/images/projects/proj1-4.jpg',
    ],
    loc:  'Jud. Ilfov',
    name: t('heavy.proj0.name'),
    desc: t('heavy.proj0.desc'),
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
    name: t('heavy.proj1.name'),
    desc: t('heavy.proj1.desc'),
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
    name: t('heavy.proj2.name'),
    desc: t('heavy.proj2.desc'),
  },
]);
</script>

<style>
/* Global pe pagina Infrastructură Grea */
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
.page-heavy {
  background: #031739;
  position: relative;
}
</style>
