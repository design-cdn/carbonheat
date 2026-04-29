<template>
  <footer id="footer">
    <div class="footer-top">
      <div class="cnt footer-top-inner">
        <!-- Left: contact info -->
        <div class="footer-info">
          <div class="footer-logo">
            <svg viewBox="0 0 36.65 32.23" height="28" fill="white" aria-hidden="true">
              <path d="M33.8,6.56c-.01-3.62-2.96-6.56-6.58-6.56s-6.58,2.95-6.58,6.58v17.45c0,2.06-1.67,3.73-3.73,3.73s-3.73-1.67-3.73-3.73V6.57h0c-.01-3.62-2.96-6.57-6.58-6.57S0,2.95,0,6.58v15.73h2.85V6.58c0-2.06,1.67-3.73,3.73-3.73s3.73,1.67,3.73,3.73v17.45c0,3.63,2.95,6.58,6.58,6.58s6.57-2.94,6.58-6.57h0V6.58c0-2.06,1.67-3.73,3.73-3.73s3.73,1.67,3.73,3.73v1.48h2.85v-1.5h0Z"/>
            </svg>
          </div>

          <p class="footer-tagline">{{ t('footer.tagline') }}</p>

          <div class="footer-contact-list">
            <a href="tel:+40000000000" class="footer-contact-item">
              <div class="fci-icon"><i class="ph ph-phone"></i></div>
              <div>
                <div class="fci-label">{{ t('footer.phone') }}</div>
                <div class="fci-val">+40 000 000 000</div>
              </div>
            </a>
            <a href="mailto:contact@carbonheat.ro" class="footer-contact-item">
              <div class="fci-icon"><i class="ph ph-envelope"></i></div>
              <div>
                <div class="fci-label">Email</div>
                <div class="fci-val">contact@carbonheat.ro</div>
              </div>
            </a>
            <div class="footer-contact-item">
              <div class="fci-icon"><i class="ph ph-map-pin"></i></div>
              <div>
                <div class="fci-label">{{ t('footer.hq') }}</div>
                <div class="fci-val">România</div>
              </div>
            </div>
            <div class="footer-contact-item">
              <div class="fci-icon"><i class="ph ph-clock"></i></div>
              <div>
                <div class="fci-label">{{ t('footer.schedule') }}</div>
                <div class="fci-val">Lun–Vin, 08:00–17:00</div>
              </div>
            </div>
          </div>

          <div class="footer-social">
            <a href="#" class="footer-social-btn"><i class="ph ph-linkedin-logo"></i></a>
            <a href="#" class="footer-social-btn"><i class="ph ph-facebook-logo"></i></a>
          </div>
        </div>

        <!-- Right: contact form -->
        <div class="footer-form-wrap">
          <div class="footer-form-header">
            <p class="sec-label">{{ t('footer.form.label') }}</p>
            <h3 class="footer-form-title" v-html="t('footer.form.title')"></h3>
          </div>

          <form class="footer-form" @submit.prevent="onSubmit" v-show="!submitted">
            <div class="ff-row">
              <div class="ff-field">
                <label class="ff-label">{{ t('footer.form.name') }} *</label>
                <input class="ff-input" type="text" :placeholder="t('footer.form.namePh')" required />
              </div>
              <div class="ff-field">
                <label class="ff-label">{{ t('footer.form.company') }}</label>
                <input class="ff-input" type="text" :placeholder="t('footer.form.companyPh')" />
              </div>
            </div>
            <div class="ff-row">
              <div class="ff-field">
                <label class="ff-label">Email *</label>
                <input class="ff-input" type="email" placeholder="email@firma.ro" required />
              </div>
              <div class="ff-field">
                <label class="ff-label">{{ t('footer.form.phone') }} *</label>
                <input class="ff-input" type="tel" placeholder="+40 000 000 000" required />
              </div>
            </div>
            <div class="ff-field">
              <label class="ff-label">{{ t('footer.form.line') }} *</label>
              <select class="ff-input ff-select" required>
                <option value="">{{ t('footer.form.select') }}</option>
                <option>Hale Industriale</option>
                <option>Fotovoltaice</option>
                <option>Infrastructură Grea</option>
                <option>Automatizări Industriale</option>
                <option>General</option>
              </select>
            </div>
            <div class="ff-field">
              <label class="ff-label">{{ t('footer.form.message') }} *</label>
              <textarea class="ff-input ff-textarea" :placeholder="t('footer.form.messagePh')" required></textarea>
            </div>
            <div class="ff-check">
              <input type="checkbox" id="gdpr" required />
              <label for="gdpr">{{ t('footer.form.gdpr') }} <a href="#">{{ t('footer.form.gdprLink') }}</a>.</label>
            </div>
            <button type="submit" class="ff-submit">
              {{ t('footer.form.submit') }} <i class="ph ph-paper-plane-tilt"></i>
            </button>
          </form>

          <div class="ff-success" v-show="submitted">
            <i class="ph ph-check-circle"></i>
            {{ t('footer.form.success') }}
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="cnt footer-bottom-inner">
        <ul class="footer-links">
          <li><RouterLink to="/">Hale Industriale</RouterLink></li>
          <li><RouterLink to="/fotovoltaice">Fotovoltaice</RouterLink></li>
          <li><RouterLink to="/infrastructura-grea">Infrastructură Grea</RouterLink></li>
          <li><RouterLink to="/automatizari">Automatizări</RouterLink></li>
          <li><RouterLink to="/despre">Despre Noi</RouterLink></li>
        </ul>
        <div class="footer-legal">
          <span>© 2026 Carbon Heat SRL</span>
          <a href="#">Confidențialitate</a>
          <a href="#">Termeni</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from '../useI18n.js';

const { t } = useI18n();
const submitted = ref(false);

function onSubmit() {
  setTimeout(() => { submitted.value = true; }, 600);
}
</script>

<style scoped>
footer {
  background: #08111f;
}

.footer-top {
  padding: 120px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.cnt {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 56px;
}

.footer-top-inner {
  display: grid;
  grid-template-columns: 1fr 1.8fr;
  gap: 100px;
  align-items: start;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-tagline {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.58);
  line-height: 1.7;
  font-weight: 300;
  max-width: 300px;
  font-family: 'Outfit', sans-serif;
}

.footer-contact-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.footer-contact-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer-contact-item:hover { opacity: 0.75; }

.fci-icon {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.fci-label {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 3px;
  font-family: 'Outfit', sans-serif;
}

.fci-val {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.82);
  font-weight: 500;
  font-family: 'Outfit', sans-serif;
}

.footer-social {
  display: flex;
  gap: 10px;
}

.footer-social-btn {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s;
}

.footer-social-btn:hover {
  border-color: rgba(255, 255, 255, 0.35);
  color: rgba(255, 255, 255, 0.85);
}

/* Form */
.footer-form-header { margin-bottom: 44px; }

.sec-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #2c77fa;
  margin-bottom: 12px;
  font-family: 'Outfit', sans-serif;
}

.footer-form-title {
  font-size: clamp(32px, 3.5vw, 52px);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-top: 12px;
  font-family: 'Outfit', sans-serif;
}

.footer-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ff-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.ff-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ff-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  font-family: 'Outfit', sans-serif;
}

.ff-input {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  font: 16px/1.5 'Outfit', sans-serif;
  padding: 18px 22px;
  border-radius: 12px;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  width: 100%;
}

.ff-input::placeholder { color: rgba(255, 255, 255, 0.2); }
.ff-input:focus { border-color: rgba(44, 119, 250, 0.6); background: rgba(44, 119, 250, 0.05); }

.ff-select { appearance: none; cursor: pointer; }
.ff-select option { background: #0d1827; color: #fff; }
.ff-textarea { min-height: 160px; resize: vertical; }

.ff-check {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.6;
  font-family: 'Outfit', sans-serif;
}

.ff-check input { flex-shrink: 0; margin-top: 3px; accent-color: #2c77fa; outline: none; }
.ff-check a { color: #2c77fa; text-decoration: none; }

.ff-submit {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 20px 40px;
  background: #2c77fa;
  color: #fff;
  font: 600 16px/1 'Outfit', sans-serif;
  letter-spacing: 0.04em;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  align-self: flex-start;
}

.ff-submit:hover { opacity: 0.88; transform: translateY(-2px); }
.ff-submit i { font-size: 16px; }

.ff-success {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  padding: 16px 20px;
  background: rgba(44, 119, 250, 0.1);
  border: 1px solid rgba(44, 119, 250, 0.25);
  border-radius: 10px;
  font-family: 'Outfit', sans-serif;
}

.ff-success i { font-size: 20px; color: #2c77fa; }

/* Footer bottom */
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
  font-size: 14px;
  color: rgba(255, 255, 255, 0.35);
  font-family: 'Outfit', sans-serif;
}

.footer-legal a {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.35);
  text-decoration: none;
  transition: color 0.2s;
  font-family: 'Outfit', sans-serif;
}

.footer-legal a:hover { color: rgba(255, 255, 255, 0.7); }

@media (max-width: 1024px) {
  .footer-top-inner { grid-template-columns: 1fr; gap: 60px; }
}

@media (max-width: 640px) {
  .cnt { padding: 0 24px; }
  .ff-row { grid-template-columns: 1fr; }
  .footer-links { display: none; }
}
</style>
