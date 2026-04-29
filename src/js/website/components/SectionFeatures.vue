<template>
  <section class="features-strip">
    <div class="cnt">
      <div class="fs-outer">
        <div class="fs-item">
          <div class="fs-icon"><i class="ph ph-lightning"></i></div>
          <div>
            <div class="fs-title">{{ t('features.integrated.title') }}</div>
            <div class="fs-sub">{{ t('features.integrated.sub') }}</div>
          </div>
        </div>
        <div class="fs-divider"></div>
        <div class="fs-item">
          <div class="fs-icon"><i class="ph ph-gauge"></i></div>
          <div>
            <div class="fs-title">{{ t('features.efficiency.title') }}</div>
            <div class="fs-sub">{{ t('features.efficiency.sub') }}</div>
          </div>
        </div>
        <div class="fs-divider"></div>
        <div class="fs-item">
          <div class="fs-icon"><i class="ph ph-shield-check"></i></div>
          <div>
            <div class="fs-title">{{ t('features.safe.title') }}</div>
            <div class="fs-sub">{{ t('features.safe.sub') }}</div>
          </div>
        </div>
        <div class="fs-divider"></div>
        <div class="fs-item">
          <div class="fs-icon"><i class="ph ph-globe"></i></div>
          <div>
            <div class="fs-title">{{ t('features.future.title') }}</div>
            <div class="fs-sub">{{ t('features.future.sub') }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from '../useI18n.js';
const { t } = useI18n();
</script>

<style scoped>
.features-strip {
  position: relative;
  margin-top: -220px;
  padding-top: 80px;
  padding-bottom: 80px;
  z-index: 2;
}

.cnt {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 56px;
  position: relative;
  z-index: 2;
}

.fs-outer {
  display: flex;
  align-items: stretch;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 0 8px;
}

.fs-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 24px;
  min-width: 0;
}

.fs-divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  margin: 16px 0;
}

.fs-icon {
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.65);
  flex-shrink: 0;
  font-size: 20px;
}

.fs-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
  font-family: 'Outfit', sans-serif;
}

.fs-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.5;
  font-family: 'Outfit', sans-serif;
}

@media (max-width: 1024px) {
  .fs-divider { display: none; }
}

@media (max-width: 640px) {
  .cnt { padding: 0 24px; }
  .fs-outer { flex-direction: column; }
}
</style>
