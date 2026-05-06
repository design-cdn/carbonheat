<template>
  <div class="page-auto">
    <AppNav />
    <HeroPage prefix="auto.hero" videoSrc="/assets/video/bg2.mp4" />

    <SectionFeatures prefix="auto.features" bgFade />

    <SectionMegaStat
      mode="text"
      compact
      :eyebrow="t('auto.megastat.eyebrow')"
      :bigText="t('auto.megastat.text')"
      smallText="Carbon Heat Solutions"
      :clients="autoMarquee"
    />

    <SectionSpecializations
      prefix="auto.spec"
      :stat1Num="3"
      :stat2Num="1"
      :cols="autoCols"
      :partnerCols="[]"
    />

    <SectionProjects
      prefix="auto.projects"
      :projects="autoProjects"
    />

    <SectionCtaSimple
      prefix="auto.cta"
      btnHref="mailto:office@carbonheat.ro?subject=Cerere%20ofertă%20automatizări"
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

// Marquee: autorizații + capacități tehnice confirmate (din PDF Prezentare 2024)
const autoMarquee = [
  'ANRE Tip B',
  'ISO 9001',
  'ISO 14001',
  'ISO 45001',
  'Atelier propriu',
  '0–400 V',
  'BMS',
  'PLC',
  'Tablouri industriale',
  'Proiectare & Execuție',
];

const autoCols = computed(() => [
  { icon: 'ph-stack',   accent: '#fb923c', name: t('auto.col0.name'), desc: t('auto.col0.desc') },
  { icon: 'ph-cpu',     accent: '#2c77fa', name: t('auto.col1.name'), desc: t('auto.col1.desc') },
  { icon: 'ph-network', accent: '#10d4c0', name: t('auto.col2.name'), desc: t('auto.col2.desc') },
]);

// 3 proiecte placeholder — același set foto ca Hale, texte neutre tehnice.
// TO REPLACE: clientul va trimite proiecte specifice automatizări + foto reale.
const autoProjects = computed(() => [
  {
    img:  '/assets/images/projects/proj1-1.jpg',
    gallery: [
      '/assets/images/projects/proj1-1.jpg',
      '/assets/images/projects/proj1-2.jpg',
      '/assets/images/projects/proj1-3.jpg',
      '/assets/images/projects/proj1-4.jpg',
    ],
    loc:  'Jud. Ilfov',
    name: t('auto.proj0.name'),
    desc: t('auto.proj0.desc'),
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
    name: t('auto.proj1.name'),
    desc: t('auto.proj1.desc'),
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
    name: t('auto.proj2.name'),
    desc: t('auto.proj2.desc'),
  },
]);

</script>

<style>
/* Global pe pagina Automatizări */
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
.page-auto {
  background: #031739;
  position: relative;
}

</style>
