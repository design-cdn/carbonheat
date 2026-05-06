<template>
  <div class="page-about">
    <AppNav />

    <!-- About / Cine suntem -->
    <section class="about-intro" ref="introEl">
      <div class="about-intro-bg"></div>
      <div class="cnt about-intro-content" :class="{ revealed: introRevealed }">
        <h1 class="about-title">{{ t('about.title') }}</h1>
        <p class="about-lead">{{ t('about.lead') }}</p>
        <div class="about-paragraphs">
          <p>{{ t('about.p1') }}</p>
          <p>{{ t('about.p2') }}</p>
          <p>{{ t('about.p3') }}</p>
        </div>
      </div>
    </section>

    <!-- Certificări -->
    <section class="certifications" ref="certEl">
      <div class="cnt cert-header">
        <h2 class="sec-h2">{{ t('about.cert.heading') }}</h2>
      </div>
      <div class="cnt cert-grid">
        <div
          v-for="(c, i) in certifications"
          :key="i"
          class="cert-card"
          :class="{ revealed: certRevealed[i] }"
          :ref="el => certRefs[i] = el"
          :style="{ '--card-accent': c.accent }"
        >
          <div class="cert-icon"><i :class="'ph ' + c.icon"></i></div>
          <div class="cert-name">{{ c.name }}</div>
          <div class="cert-desc">{{ c.desc }}</div>
        </div>
      </div>
    </section>

    <!-- Echipa -->
    <section class="team" ref="teamEl">
      <div class="cnt team-header">
        <h2 class="sec-h2">{{ t('about.team.heading') }}</h2>
        <p class="team-intro">{{ t('about.team.intro') }}</p>
      </div>
      <div class="cnt team-grid">
        <article
          v-for="(m, i) in members"
          :key="i"
          class="team-card"
          :class="{ revealed: teamRevealed[i] }"
          :ref="el => teamRefs[i] = el"
          :style="{ '--card-accent': m.accent }"
        >
          <div class="team-photo">
            <img :src="m.photo" :alt="m.name" class="team-photo-img" />
            <div class="team-photo-shine"></div>
          </div>
          <div class="team-body">
            <div class="team-line">
              <h3 class="team-name">{{ m.name }}</h3>
              <p class="team-role">{{ m.role }}</p>
            </div>
            <div class="team-contacts">
              <a :href="`tel:${m.tel.replace(/\s/g, '')}`" class="team-contact">
                <i class="ph ph-phone"></i>
                <span>{{ m.tel }}</span>
              </a>
              <a :href="`mailto:${m.email}`" class="team-contact">
                <i class="ph ph-envelope"></i>
                <span>{{ m.email }}</span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import AppNav    from '../components/AppNav.vue';
import AppFooter from '../components/AppFooter.vue';
import { useI18n }      from '../useI18n.js';

const { t } = useI18n();

const certifications = computed(() => [
  { icon: 'ph-medal',        accent: '#2c77fa', name: 'ISO 9001',                              desc: t('about.cert0.desc') },
  { icon: 'ph-leaf',         accent: '#10d4c0', name: 'ISO 14001',                             desc: t('about.cert1.desc') },
  { icon: 'ph-shield-check', accent: '#fb923c', name: 'ISO 45001',                             desc: t('about.cert2.desc') },
  { icon: 'ph-lightning',    accent: '#8b5cf6', name: 'ANRE Tip B',                            desc: t('about.cert3.desc') },
  { icon: 'ph-fire',         accent: '#f43f5e', name: t('about.cert4.name'),                   desc: t('about.cert4.desc') },
]);

// Membri echipă — placeholder. TO REPLACE cu date reale + foto de la client.
const members = computed(() => [
  { photo: '/assets/images/team-1.jpg', accent: '#2c77fa', name: 'Alexandru Ionescu', role: t('about.role0'), tel: '+40 700 000 001', email: 'office@carbonheat.ro' },
  { photo: '/assets/images/team-2.jpg', accent: '#10d4c0', name: 'Maria Constantin',  role: t('about.role1'), tel: '+40 700 000 002', email: 'hale@carbonheat.ro' },
  { photo: '/assets/images/team-3.jpg', accent: '#fb923c', name: 'Andrei Popescu',    role: t('about.role2'), tel: '+40 700 000 003', email: 'fotovoltaice@carbonheat.ro' },
  { photo: '/assets/images/team-4.jpg', accent: '#8b5cf6', name: 'Elena Dumitrescu', role: t('about.role3'), tel: '+40 700 000 004', email: 'automatizari@carbonheat.ro' },
]);

const introEl       = ref(null);
const certEl        = ref(null);
const teamEl        = ref(null);
const certRefs      = reactive([]);
const teamRefs      = reactive([]);
const introRevealed = ref(false);
const certRevealed  = reactive({});
const teamRevealed  = reactive({});

function makeRevealer(target, callback) {
  return () => {
    if (!target.value) return;
    const rect = target.value.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      callback();
      return true;
    }
    return false;
  };
}

function revealStaggered(refs, store) {
  refs.forEach((el, i) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0 && !store[i]) {
      setTimeout(() => { store[i] = true; }, i * 90);
    }
  });
}

function checkAll() {
  if (!introRevealed.value && introEl.value) {
    const r = introEl.value.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.85) introRevealed.value = true;
  }
  revealStaggered(certRefs, certRevealed);
  revealStaggered(teamRefs, teamRevealed);
}

onMounted(() => {
  checkAll();
  window.addEventListener('scroll', checkAll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkAll);
});
</script>

<style>
/* Global pe pagina Despre Noi */
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
.page-about {
  background: #031739;
  position: relative;
  min-height: 100vh;
}

.cnt {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 56px;
  position: relative;
  z-index: 2;
}

/* ---------- About Intro ---------- */
.about-intro {
  position: relative;
  padding: 200px 0 120px;
  overflow: hidden;
}

.about-intro-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 70% at 25% 30%, rgba(44,119,250,0.20) 0%, transparent 60%),
    radial-gradient(ellipse 50% 60% at 80% 60%, rgba(16,212,192,0.14) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 50% 100%, rgba(80,30,180,0.18) 0%, transparent 55%);
  z-index: 0;
}

.about-intro-content {
  text-align: center;
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.9s ease, transform 0.9s ease;
}
.about-intro-content.revealed { opacity: 1; transform: translateY(0); }

.about-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 32px;
}

.about-title {
  font-size: clamp(36px, 5.5vw, 88px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  color: #fff;
  margin: 0 0 36px;
  background: linear-gradient(135deg, #ffffff 0%, #cce0ff 60%, #6aa9ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.about-lead {
  font-size: clamp(22px, 2.4vw, 32px);
  font-weight: 400;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.86);
  margin: 0 0 56px;
  letter-spacing: -0.01em;
}

.about-paragraphs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.about-paragraphs p {
  font-size: 16px;
  line-height: 1.65;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  text-align: left;
}

/* ---------- Certifications ---------- */
.certifications {
  position: relative;
  padding: 120px 0 100px;
  background: linear-gradient(180deg, #031739 0%, #02152e 100%);
}

.cert-header { margin-bottom: 64px; }

.sec-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #2c77fa;
  margin: 0 0 18px;
}

.sec-h2 {
  font-size: clamp(36px, 4.5vw, 64px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.025em;
  color: #fff;
  margin: 0;
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.cert-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 32px 24px;
  transition: opacity 0.6s ease, transform 0.6s ease, border-color 0.3s, background 0.3s;
  opacity: 0;
  transform: translateY(28px);
  position: relative;
  overflow: hidden;
}

.cert-card.revealed { opacity: 1; transform: translateY(0); }

.cert-card::before {
  content: '';
  position: absolute;
  top: 0; left: 12%; right: 12%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
  opacity: 0.4;
  transition: opacity 0.3s, left 0.3s, right 0.3s;
}

.cert-card:hover {
  border-color: rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-4px);
}
.cert-card:hover::before { left: 0; right: 0; opacity: 1; }

.cert-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--card-accent);
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 20px;
}

.cert-name {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin-bottom: 10px;
}

.cert-desc {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.55;
}

/* ---------- Team ---------- */
.team {
  position: relative;
  padding: 120px 0 140px;
  background: #02152e;
  overflow: hidden;
}

.team::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 80% 20%, rgba(44,119,250,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 40% 50% at 15% 85%, rgba(16,212,192,0.10) 0%, transparent 60%);
  pointer-events: none;
}

.team-header {
  margin-bottom: 64px;
}

.team-intro {
  font-size: 17px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.66);
  line-height: 1.6;
  margin: 24px 0 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.team-card {
  background: linear-gradient(160deg, rgba(30, 65, 140, 0.45) 0%, rgba(8, 20, 55, 0.55) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(36px) scale(0.96);
  transition: opacity 0.55s cubic-bezier(0.34, 1.2, 0.64, 1),
              transform 0.55s cubic-bezier(0.34, 1.2, 0.64, 1),
              box-shadow 0.4s ease,
              border-color 0.3s;
  position: relative;
}

.team-card.revealed { opacity: 1; transform: translateY(0) scale(1); }

.team-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow:
    0 24px 60px rgba(0,0,0,0.45),
    0 0 0 1px rgba(255,255,255,0.08),
    inset 0 1px 0 rgba(255,255,255,0.10),
    0 0 60px color-mix(in srgb, var(--card-accent) 18%, transparent);
}

.team-card:hover .team-photo-shine { transform: translateX(120%); }
.team-card:hover .team-photo { transform: scale(1.04); }

.team-photo {
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.team-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(2,13,26,0.5) 100%);
  pointer-events: none;
}

.team-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.team-photo-shine {
  position: absolute;
  top: 0; left: 0;
  width: 60%;
  height: 100%;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.10) 50%, transparent 70%);
  transform: translateX(-120%);
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.team-body {
  padding: 24px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.team-line { position: relative; }

.team-name {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #fff;
  margin: 0 0 4px;
  line-height: 1.2;
}

.team-role {
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.62);
  margin: 0;
  line-height: 1.4;
}

.team-contacts {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding-top: 20px;
}

.team-contact {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  font-weight: 400;
  transition: color 0.2s;
}
.team-contact:hover { color: #2c77fa; }

.team-contact i {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.45);
  transition: color 0.2s;
  flex-shrink: 0;
}
.team-contact:hover i {
  color: #2c77fa;
}

/* ---------- Responsive ---------- */
@media (max-width: 1024px) {
  .cert-grid { grid-template-columns: repeat(3, 1fr); }
  .team-grid { grid-template-columns: repeat(2, 1fr); }
  .about-paragraphs { grid-template-columns: 1fr; gap: 20px; }
}

@media (max-width: 640px) {
  .cnt { padding: 0 24px; }
  .about-intro { padding: 140px 0 80px; }
  .cert-grid { grid-template-columns: 1fr; }
  .team-grid { grid-template-columns: 1fr; }
}
</style>
