<template>
  <LegalLayout
    :eyebrow="t('legal.terms.eyebrow')"
    :title="t('legal.terms.title')"
    :updated="t('legal.terms.updated')"
  >
    <div v-html="t('legal.terms.body')"></div>
  </LegalLayout>
</template>

<script setup>
import LegalLayout from '../components/LegalLayout.vue';
import { useI18n } from '../useI18n.js';

const { t } = useI18n();
</script>
