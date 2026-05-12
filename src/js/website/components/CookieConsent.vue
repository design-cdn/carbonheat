<template>
  <Transition name="cc-fade">
    <div v-if="open" class="cc-overlay" role="dialog" aria-modal="false" :aria-label="t('cookie.title')">
      <div class="cc-card">
        <button class="cc-close" type="button" @click="rejectNonEssential" :aria-label="t('cookie.close')">
          <i class="ph ph-x"></i>
        </button>

        <div class="cc-icon"><i class="ph ph-cookie"></i></div>
        <h2 class="cc-title">{{ t('cookie.title') }}</h2>
        <p class="cc-text">
          {{ t('cookie.text') }}
          <RouterLink to="/confidentialitate" class="cc-link" @click="open = false">{{ t('cookie.policyLink') }}</RouterLink>.
        </p>

        <div v-if="expanded" class="cc-cats">
          <label class="cc-cat" :class="{ disabled: true }">
            <input type="checkbox" checked disabled />
            <div>
              <div class="cc-cat-name">{{ t('cookie.cat.essential.name') }}</div>
              <div class="cc-cat-desc">{{ t('cookie.cat.essential.desc') }}</div>
            </div>
          </label>
          <label class="cc-cat">
            <input type="checkbox" v-model="prefs.analytics" />
            <div>
              <div class="cc-cat-name">{{ t('cookie.cat.analytics.name') }}</div>
              <div class="cc-cat-desc">{{ t('cookie.cat.analytics.desc') }}</div>
            </div>
          </label>
          <label class="cc-cat">
            <input type="checkbox" v-model="prefs.marketing" />
            <div>
              <div class="cc-cat-name">{{ t('cookie.cat.marketing.name') }}</div>
              <div class="cc-cat-desc">{{ t('cookie.cat.marketing.desc') }}</div>
            </div>
          </label>
        </div>

        <div class="cc-actions">
          <button v-if="!expanded" type="button" class="cc-btn cc-btn-ghost" @click="expanded = true">
            {{ t('cookie.btn.configure') }}
          </button>
          <button v-else type="button" class="cc-btn cc-btn-ghost" @click="saveChosen">
            {{ t('cookie.btn.save') }}
          </button>
          <button type="button" class="cc-btn cc-btn-secondary" @click="rejectNonEssential">
            {{ t('cookie.btn.reject') }}
          </button>
          <button type="button" class="cc-btn cc-btn-primary" @click="acceptAll">
            {{ t('cookie.btn.accept') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from '../useI18n.js';

const { t } = useI18n();

const STORAGE_KEY = 'ch_cookies_seen';

const open     = ref(false);
const expanded = ref(false);
const prefs    = reactive({ analytics: false, marketing: false });

function close() { open.value = false; }
function mark()  { sessionStorage.setItem(STORAGE_KEY, '1'); }

function acceptAll() {
  prefs.analytics = true;
  prefs.marketing = true;
  mark();
  close();
}
function rejectNonEssential() {
  prefs.analytics = false;
  prefs.marketing = false;
  mark();
  close();
}
function saveChosen() {
  mark();
  close();
}

onMounted(() => {
  if (!sessionStorage.getItem(STORAGE_KEY)) {
    setTimeout(() => { open.value = true; }, 700);
  }
});
</script>

<style scoped>
.cc-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: radial-gradient(ellipse at bottom, rgba(2, 13, 26, 0.55) 0%, rgba(2, 13, 26, 0.25) 60%, transparent 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 24px;
  pointer-events: none;
}

.cc-card {
  position: relative;
  width: 100%;
  max-width: 540px;
  background: linear-gradient(160deg, rgba(30, 65, 140, 0.85) 0%, rgba(8, 20, 55, 0.92) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 28px 28px 24px;
  color: #d8eaf6;
  font-family: 'Outfit', sans-serif;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  pointer-events: auto;
  margin-right: 96px; /* leave room for WhatsApp FAB on desktop */
}

.cc-card::before {
  content: '';
  position: absolute;
  top: 0; left: 18%; right: 18%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #2c77fa, transparent);
  opacity: 0.5;
}

.cc-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.cc-close:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.cc-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(44, 119, 250, 0.14);
  border: 1px solid rgba(44, 119, 250, 0.4);
  color: #2c77fa;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.cc-title {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #fff;
  margin: 0 0 8px;
}

.cc-text {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 20px;
}

.cc-link {
  color: #6aa9ff;
  text-decoration: underline;
  text-decoration-color: rgba(106, 169, 255, 0.4);
  text-underline-offset: 3px;
  transition: color 0.2s;
}
.cc-link:hover { color: #fff; }

.cc-cats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 4px 0 20px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.cc-cat {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}
.cc-cat.disabled { cursor: default; opacity: 0.75; }

.cc-cat input[type="checkbox"] {
  flex-shrink: 0;
  margin-top: 3px;
  width: 16px;
  height: 16px;
  accent-color: #2c77fa;
  cursor: pointer;
}
.cc-cat.disabled input { cursor: not-allowed; }

.cc-cat-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
  letter-spacing: -0.005em;
}

.cc-cat-desc {
  font-size: 12px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.45;
}

.cc-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.cc-btn {
  padding: 11px 18px;
  border-radius: 50px;
  font: 600 13px/1 'Outfit', sans-serif;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}
.cc-btn-ghost {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.7);
}
.cc-btn-ghost:hover {
  border-color: rgba(255, 255, 255, 0.32);
  color: #fff;
}
.cc-btn-secondary {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.85);
}
.cc-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}
.cc-btn-primary {
  background: #2c77fa;
  border-color: #2c77fa;
  color: #fff;
  box-shadow: 0 6px 16px rgba(44, 119, 250, 0.35);
}
.cc-btn-primary:hover {
  background: #4488ff;
  border-color: #4488ff;
}

.cc-fade-enter-active, .cc-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.cc-fade-enter-from, .cc-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 640px) {
  .cc-overlay { padding: 16px; align-items: flex-end; }
  .cc-card { padding: 22px 20px 20px; margin-right: 0; margin-bottom: 80px; }
  .cc-title { font-size: 17px; }
  .cc-text { font-size: 13px; }
  .cc-actions { gap: 8px; flex-direction: column-reverse; }
  .cc-btn { width: 100%; padding: 13px 18px; }
}
</style>
