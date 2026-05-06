<template>
  <section class="hero-page" :class="{ 'has-video': videoSrc }">
    <video
      v-if="videoSrc"
      class="hero-video"
      :src="videoSrc"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    ></video>
    <div v-else class="hero-bg"></div>
    <div class="hero-overlay"></div>
    <div class="hero-bottom-fade"></div>

    <div class="hero-text">
      <h1 class="title">{{ t(prefix + '.overline') }}</h1>
      <p class="subtitle">
        <span>{{ t(prefix + '.headline1') }}</span>
        <em>{{ t(prefix + '.headline2') }}</em>
      </p>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from '../useI18n.js';

const { t } = useI18n();

const props = defineProps({
  prefix:   { type: String, default: 'solar.hero' },
  videoSrc: { type: String, default: '' },
});

const { prefix, videoSrc } = props;
</script>

<style scoped>
.hero-page {
  position: relative;
  height: 80vh;
  min-height: 540px;
  overflow: hidden;
  background: #020d1a;
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 80% at 50% 30%, rgba(44,119,250,0.32) 0%, transparent 60%),
    radial-gradient(ellipse 80% 60% at 20% 80%, rgba(16,212,192,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 70% 70% at 90% 20%, rgba(80,30,180,0.18) 0%, transparent 55%),
    linear-gradient(180deg, #020d1a 0%, #031739 60%, #02152e 100%);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse 65% 65% at 50% 45%, rgba(2,13,26,0.55) 0%, rgba(2,13,26,0.85) 70%, rgba(2,13,26,0.95) 100%),
    linear-gradient(180deg, rgba(2,13,26,0.65) 0%, rgba(3,23,57,0.55) 50%, rgba(2,13,26,0.85) 100%);
  pointer-events: none;
}

.hero-page.has-video .hero-overlay {
  background:
    radial-gradient(ellipse 65% 65% at 50% 45%, rgba(2,13,26,0.55) 0%, rgba(2,13,26,0.78) 70%, rgba(2,13,26,0.92) 100%),
    linear-gradient(180deg, rgba(2,13,26,0.55) 0%, rgba(3,23,57,0.5) 50%, rgba(2,13,26,0.85) 100%);
}

.hero-bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 440px;
  z-index: 5;
  background: linear-gradient(180deg, transparent 0%, rgba(2,13,26,0.4) 35%, rgba(2,13,26,0.85) 70%, #020d1a 100%);
  pointer-events: none;
}

.hero-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: min(86%, 1200px);
  text-align: center;
}

.title {
  padding: 0 32px;
  font-size: clamp(36px, 5.5vw, 88px);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.03em;
  font-family: 'Outfit', sans-serif;
  color: #fff;
  margin: 0 0 28px;
}

.subtitle {
  padding: 0 32px;
  font-size: clamp(18px, 2.2vw, 28px);
  font-weight: 400;
  line-height: 1.35;
  letter-spacing: -0.01em;
  font-family: 'Outfit', sans-serif;
  color: rgba(255, 255, 255, 0.78);
  margin: 0;
}

.subtitle span { color: rgba(255, 255, 255, 0.78); }

.subtitle em {
  display: inline;
  font-style: normal;
  font-weight: 500;
  color: #2c77fa;
}

@media (max-width: 640px) {
  .hero-page { height: 70vh; min-height: 480px; }
  .title, .subtitle { padding: 0 16px; }
}
</style>
