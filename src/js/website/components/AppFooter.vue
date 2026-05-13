<template>
  <footer id="footer">
    <div class="footer-bottom">
      <div class="cnt footer-bottom-inner">
        <ul class="footer-links">
          <li><RouterLink to="/">{{ t('nav.halls') }}</RouterLink></li>
          <li><RouterLink to="/fotovoltaice">{{ t('nav.solar') }}</RouterLink></li>
          <li><RouterLink to="/infrastructura-grea">{{ t('nav.heavy') }}</RouterLink></li>
          <li><RouterLink to="/automatizari-industriale">{{ t('nav.automation') }}</RouterLink></li>
          <li><RouterLink to="/despre-noi">{{ t('nav.about') }}</RouterLink></li>
          <li><RouterLink to="/despre-noi#contact">{{ t('nav.cta') }}</RouterLink></li>
        </ul>
        <div class="footer-legal">
          <span>© 2026 SC Carbon Heat Solutions SRL</span>
          <span class="footer-legal-sep">·</span>
          <span>CUI RO 36608956</span>
          <span class="footer-legal-sep">·</span>
          <span>J2016013197408</span>
          <RouterLink to="/confidentialitate">{{ t('footer.privacy') }}</RouterLink>
          <RouterLink to="/termeni">{{ t('footer.terms') }}</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from '../useI18n.js';

const { t } = useI18n();
</script>

<style scoped>
footer {
  background: #08111f;
}

.cnt {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 56px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px 0;
}

.footer-bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-links {
  list-style: none;
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}

.footer-links a {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  transition: color 0.2s;
  font-family: 'Outfit', sans-serif;
}

.footer-links a:hover { color: rgba(255, 255, 255, 0.9); }

.footer-legal {
  display: flex;
  gap: 20px;
  align-items: center;
}

.footer-legal span {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  font-family: 'Outfit', sans-serif;
}

.footer-legal-sep {
  color: rgba(255, 255, 255, 0.15) !important;
}

.footer-legal a {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.35);
  text-decoration: none;
  transition: color 0.2s;
  font-family: 'Outfit', sans-serif;
}

.footer-legal a:hover { color: rgba(255, 255, 255, 0.7); }

@media (max-width: 640px) {
  .cnt { padding: 0 24px; }
  .footer-bottom { padding: 20px 0 28px; }
  .footer-bottom-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
  .footer-links a { font-size: 14px; }

  .footer-legal {
    flex-wrap: wrap;
    gap: 8px 14px;
    width: 100%;
  }
  .footer-legal span { font-size: 12px; }
  .footer-legal a { font-size: 12px; }
  .footer-legal-sep { display: none; }
}
</style>
