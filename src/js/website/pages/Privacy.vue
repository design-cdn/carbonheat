<template>
  <LegalLayout
    :eyebrow="t('legal.privacy.eyebrow')"
    :title="t('legal.privacy.title')"
    :updated="t('legal.privacy.updated')"
  >
    <div v-html="t('legal.privacy.body')"></div>
  </LegalLayout>
</template>

<script setup>
import LegalLayout from '../components/LegalLayout.vue';
import { useI18n } from '../useI18n.js';

const { t } = useI18n();
</script>
