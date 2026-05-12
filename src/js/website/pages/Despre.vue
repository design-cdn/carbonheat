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

      <div class="cnt team-filters" role="tablist" aria-label="Filtru linie business">
        <button
          v-for="f in filters"
          :key="f.key"
          type="button"
          role="tab"
          class="team-filter"
          :class="{ active: activeFilter === f.key }"
          :style="f.key !== 'all' ? { '--filter-accent': f.accent } : null"
          @click="setFilter(f.key)"
        >
          <span class="team-filter-label">{{ f.label }}</span>
          <span class="team-filter-count">{{ f.count }}</span>
        </button>
      </div>

      <div class="cnt">
        <TransitionGroup tag="div" name="team" class="team-grid">
          <article
            v-for="m in filteredMembers"
            :key="m.id"
            class="team-card"
            :style="{ '--card-accent': m.accent }"
          >
            <div class="team-main">
              <div class="team-photo">
                <img :src="m.photo" :alt="m.name" loading="lazy" decoding="async" />
              </div>
              <div class="team-body">
                <div>
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
            </div>
            <div class="team-tags">
              <button
                v-for="line in m.lines"
                :key="line"
                type="button"
                class="team-tag"
                :class="{ active: activeFilter === line }"
                :style="{ '--tag-accent': lineAccent[line] }"
                @click="setFilter(line)"
              >{{ t('about.line.' + line) }}</button>
            </div>
          </article>
        </TransitionGroup>
      </div>
    </section>

    <SectionContact />
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import AppNav         from '../components/AppNav.vue';
import AppFooter      from '../components/AppFooter.vue';
import SectionContact from '../components/SectionContact.vue';
import { useI18n }      from '../useI18n.js';

const { t } = useI18n();

const certifications = computed(() => [
  { icon: 'ph-medal',        accent: '#2c77fa', name: 'ISO 9001',                              desc: t('about.cert0.desc') },
  { icon: 'ph-leaf',         accent: '#10d4c0', name: 'ISO 14001',                             desc: t('about.cert1.desc') },
  { icon: 'ph-shield-check', accent: '#fb923c', name: 'ISO 45001',                             desc: t('about.cert2.desc') },
  { icon: 'ph-lightning',    accent: '#8b5cf6', name: 'ANRE Tip B',                            desc: t('about.cert3.desc') },
  { icon: 'ph-fire',         accent: '#f43f5e', name: t('about.cert4.name'),                   desc: t('about.cert4.desc') },
]);

// Linii de business — accent color + label sursă i18n
const lineAccent = {
  hale:            '#2c77fa',
  fotovoltaice:    '#10d4c0',
  infrastructura:  '#fb923c',
  automatizari:    '#8b5cf6',
};

// Helper: ciclează cele 4 poze placeholder
const photoFor = (idx) => `/assets/images/team-${(idx % 4) + 1}.jpg`;

// Membri echipă — placeholder (15). TO REPLACE cu date reale + foto de la client.
const membersData = [
  { id:  0, roleKey: 'about.role0',  name: 'Alexandru Ionescu',   tel: '+40 786 602 644', email: 'alexandru@carbonheat.ro', lines: ['hale', 'fotovoltaice', 'infrastructura', 'automatizari'] },
  { id:  1, roleKey: 'about.role1',  name: 'Maria Constantin',    tel: '+40 745 102 233', email: 'maria@carbonheat.ro',     lines: ['hale', 'fotovoltaice'] },
  { id:  2, roleKey: 'about.role2',  name: 'Andrei Popescu',      tel: '+40 723 845 117', email: 'andrei@carbonheat.ro',    lines: ['hale'] },
  { id:  3, roleKey: 'about.role3',  name: 'Elena Dumitrescu',    tel: '+40 731 998 442', email: 'elena@carbonheat.ro',     lines: ['automatizari', 'hale'] },
  { id:  4, roleKey: 'about.role4',  name: 'Mihai Stoica',        tel: '+40 740 612 309', email: 'mihai@carbonheat.ro',     lines: ['fotovoltaice'] },
  { id:  5, roleKey: 'about.role5',  name: 'Cristian Vasilescu',  tel: '+40 762 334 558', email: 'cristian@carbonheat.ro',  lines: ['infrastructura'] },
  { id:  6, roleKey: 'about.role6',  name: 'Ioana Marinescu',     tel: '+40 758 220 901', email: 'ioana@carbonheat.ro',     lines: ['fotovoltaice'] },
  { id:  7, roleKey: 'about.role7',  name: 'Radu Anghel',         tel: '+40 727 445 116', email: 'radu@carbonheat.ro',      lines: ['hale', 'automatizari'] },
  { id:  8, roleKey: 'about.role8',  name: 'Diana Pop',           tel: '+40 749 088 213', email: 'diana@carbonheat.ro',     lines: ['automatizari'] },
  { id:  9, roleKey: 'about.role9',  name: 'Bogdan Stan',         tel: '+40 735 671 940', email: 'bogdan@carbonheat.ro',    lines: ['fotovoltaice'] },
  { id: 10, roleKey: 'about.role10', name: 'George Tudor',        tel: '+40 768 332 154', email: 'george@carbonheat.ro',    lines: ['infrastructura'] },
  { id: 11, roleKey: 'about.role11', name: 'Adrian Ocneanu',      tel: '+40 722 119 087', email: 'adrian@carbonheat.ro',    lines: ['infrastructura', 'automatizari'] },
  { id: 12, roleKey: 'about.role12', name: 'Raluca Stanciu',      tel: '+40 754 803 226', email: 'raluca@carbonheat.ro',    lines: ['hale'] },
  { id: 13, roleKey: 'about.role13', name: 'Sorin Marin',         tel: '+40 730 558 401', email: 'sorin@carbonheat.ro',     lines: ['hale'] },
  { id: 14, roleKey: 'about.role14', name: 'Vlad Iliescu',        tel: '+40 766 217 884', email: 'vlad@carbonheat.ro',      lines: ['hale', 'fotovoltaice'] },
];

const members = computed(() => membersData.map((m) => ({
  ...m,
  role:   t(m.roleKey),
  photo:  photoFor(m.id),
  accent: lineAccent[m.lines[0]],
})));

// Filtru
const FILTER_STORAGE_KEY = 'ch_team_filter';
const validFilters = ['all', 'hale', 'fotovoltaice', 'infrastructura', 'automatizari'];
const initialFilter = (() => {
  const stored = sessionStorage.getItem(FILTER_STORAGE_KEY);
  return validFilters.includes(stored) ? stored : 'all';
})();
const activeFilter = ref(initialFilter);

function setFilter(key) {
  activeFilter.value = key;
  sessionStorage.setItem(FILTER_STORAGE_KEY, key);
}

const filters = computed(() => {
  const lines = ['hale', 'fotovoltaice', 'infrastructura', 'automatizari'];
  return [
    { key: 'all', label: t('about.team.filterAll'), count: membersData.length },
    ...lines.map((key) => ({
      key,
      label:  t('about.line.' + key),
      accent: lineAccent[key],
      count:  membersData.filter((m) => m.lines.includes(key)).length,
    })),
  ];
});

const filteredMembers = computed(() => {
  if (activeFilter.value === 'all') return members.value;
  return members.value.filter((m) => m.lines.includes(activeFilter.value));
});

const introEl       = ref(null);
const certEl        = ref(null);
const teamEl        = ref(null);
const certRefs      = reactive([]);
const introRevealed = ref(false);
const certRevealed  = reactive({});

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

/* Filter bar */
.team-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 40px;
}

.team-filter {
  --filter-accent: #2c77fa;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.78);
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: all 0.2s;
}
.team-filter:hover {
  border-color: rgba(255, 255, 255, 0.22);
  color: #fff;
}
.team-filter.active {
  background: var(--filter-accent);
  border-color: var(--filter-accent);
  color: #fff;
  box-shadow: 0 6px 20px color-mix(in srgb, var(--filter-accent) 35%, transparent);
}
.team-filter-count {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.68);
}
.team-filter.active .team-filter-count {
  background: rgba(0, 0, 0, 0.18);
  color: rgba(255, 255, 255, 0.95);
}

/* Grid */
.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  position: relative;
}

/* Card */
.team-card {
  background: linear-gradient(160deg, rgba(30, 65, 140, 0.45) 0%, rgba(8, 20, 55, 0.55) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.4s, transform 0.3s;
}
.team-card::before {
  content: '';
  position: absolute;
  top: 0; left: 14%; right: 14%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
  opacity: 0.35;
  transition: opacity 0.3s, left 0.3s, right 0.3s;
}
.team-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
  transform: translateY(-3px);
  box-shadow:
    0 20px 50px rgba(0,0,0,0.40),
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 0 50px color-mix(in srgb, var(--card-accent) 18%, transparent);
}
.team-card:hover::before { left: 0; right: 0; opacity: 1; }

.team-main {
  display: flex;
  gap: 18px;
}

.team-photo {
  flex-shrink: 0;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255,255,255,0.10);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}
.team-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.team-card:hover .team-photo img { transform: scale(1.06); }
.team-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(2,13,26,0.45) 100%);
  pointer-events: none;
}

.team-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-name {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #fff;
  margin: 0 0 2px;
  line-height: 1.2;
}
.team-role {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255,255,255,0.58);
  margin: 0;
  line-height: 1.3;
}

.team-contacts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.team-contact {
  display: flex;
  align-items: center;
  gap: 7px;
  text-decoration: none;
  color: rgba(255,255,255,0.72);
  font-size: 12px;
  font-weight: 400;
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.team-contact i {
  font-size: 13px;
  color: rgba(255,255,255,0.42);
  flex-shrink: 0;
  transition: color 0.2s;
}
.team-contact span {
  overflow: hidden;
  text-overflow: ellipsis;
}
.team-contact:hover { color: var(--card-accent); }
.team-contact:hover i { color: var(--card-accent); }

/* Tags */
.team-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
}
.team-tag {
  --tag-accent: #2c77fa;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 4px 9px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.78);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-family: inherit;
}
.team-tag:hover {
  border-color: color-mix(in srgb, var(--tag-accent) 60%, transparent);
  background: color-mix(in srgb, var(--tag-accent) 14%, transparent);
  color: #fff;
}
.team-tag.active {
  border-color: var(--tag-accent);
  background: color-mix(in srgb, var(--tag-accent) 22%, transparent);
  color: #fff;
}

/* TransitionGroup FLIP */
.team-move,
.team-enter-active,
.team-leave-active {
  transition: all 280ms cubic-bezier(0.22, 1, 0.36, 1);
}
.team-enter-from,
.team-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.team-leave-active {
  position: absolute;
  width: calc((100% - 40px) / 3);
}

/* ---------- Responsive ---------- */
@media (max-width: 1024px) {
  .cert-grid { grid-template-columns: repeat(3, 1fr); }
  .team-grid { grid-template-columns: repeat(2, 1fr); }
  .team-leave-active { width: calc((100% - 20px) / 2); }
  .about-paragraphs { grid-template-columns: 1fr; gap: 20px; }
}

@media (max-width: 640px) {
  .cnt { padding: 0 24px; }
  .about-intro { padding: 140px 0 80px; }
  .cert-grid { grid-template-columns: 1fr; }
  .team-grid { grid-template-columns: 1fr; }
  .team-leave-active { width: 100%; }
}
</style>
