<template>
  <a
    class="wa-fab"
    :href="link"
    target="_blank"
    rel="noopener"
    :aria-label="t('wa.label')"
  >
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
      <path fill="#fff" d="M16.003 3C8.83 3 3 8.83 3 16.003c0 2.288.6 4.523 1.74 6.49L3 29l6.66-1.713a13.026 13.026 0 006.34 1.615h.006C23.18 28.902 29 23.073 29 15.9 29 12.42 27.66 9.146 25.214 6.7A12.94 12.94 0 0016.003 3zm0 23.86h-.005a10.86 10.86 0 01-5.532-1.514l-.397-.236-3.95 1.016 1.05-3.85-.26-.41a10.84 10.84 0 01-1.66-5.764c.002-6 4.88-10.878 10.886-10.878 2.905 0 5.636 1.13 7.69 3.183 2.054 2.054 3.183 4.787 3.182 7.692.002 6-4.877 10.762-10.885 10.762zm5.97-8.143c-.327-.164-1.937-.957-2.237-1.066-.3-.11-.518-.164-.736.164-.218.327-.846 1.066-1.038 1.284-.19.218-.382.246-.71.082-.327-.164-1.382-.51-2.633-1.624-.973-.867-1.63-1.94-1.82-2.267-.19-.327-.02-.504.144-.667.148-.146.327-.382.49-.573.164-.19.218-.327.327-.546.11-.218.055-.41-.028-.573-.082-.164-.736-1.775-1.01-2.43-.265-.638-.534-.55-.736-.56l-.627-.012c-.218 0-.573.082-.873.41-.3.327-1.146 1.12-1.146 2.73 0 1.61 1.173 3.165 1.337 3.383.164.218 2.31 3.525 5.6 4.946.782.338 1.392.539 1.868.69.785.25 1.5.215 2.065.13.63-.094 1.937-.792 2.21-1.557.273-.766.273-1.422.19-1.557-.082-.137-.3-.218-.627-.382z"/>
    </svg>
  </a>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from '../useI18n.js';

const { t } = useI18n();

const PHONE = '40786602644';
const link = computed(() => {
  const msg = encodeURIComponent(t('wa.prefill'));
  return `https://wa.me/${PHONE}?text=${msg}`;
});
</script>

<style scoped>
.wa-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 50;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #25D366;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow:
    0 12px 28px rgba(37, 211, 102, 0.35),
    0 4px 10px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s;
}
.wa-fab::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(37, 211, 102, 0.45);
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.35s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.wa-fab:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow:
    0 16px 36px rgba(37, 211, 102, 0.5),
    0 6px 14px rgba(0, 0, 0, 0.3);
}
.wa-fab:hover::after {
  opacity: 1;
  transform: scale(1);
}
.wa-fab:active {
  transform: translateY(-1px) scale(1.0);
}
.wa-fab:focus-visible {
  outline: 3px solid rgba(37, 211, 102, 0.6);
  outline-offset: 4px;
}

@media (max-width: 640px) {
  .wa-fab {
    right: 16px;
    bottom: 16px;
    width: 56px;
    height: 56px;
  }
  .wa-fab svg { width: 28px; height: 28px; }
}
</style>
