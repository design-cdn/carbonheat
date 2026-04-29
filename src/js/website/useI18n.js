import { ref, computed } from 'vue';

// Bundled translations — fetched from Enso's /api/i18n at runtime and merged.
// Fallbacks here ensure the site renders correctly even offline or before fetch completes.
const FALLBACK = {
    ro: {
        'nav.halls': 'Hale Industriale',
        'nav.solar': 'Fotovoltaice',
        'nav.heavy': 'Infrastructură Grea',
        'nav.automation': 'Automatizări',
        'nav.about': 'Despre Noi',
        'nav.cta': 'Ia legătura',
        'hero.overline': 'Echipare completă · Hale industriale',
        'hero.headline1': 'Preluăm hale goale.',
        'hero.headline2': 'Livrăm instalații funcționale.',
        'sys.electric': 'Instalații Electrice',
        'sys.hvac': 'Ventilație & Climatizare',
        'sys.sanitary': 'Instalații Sanitare',
        'sys.fire': 'Stingere Incendiu',
        'sys.bms': 'BMS & Automatizare',
        'sys.other': '+ alte specializări',
        'sys.abbr.electric': 'ELECTRIC',
        'sys.abbr.hvac': 'HVAC',
        'sys.abbr.sanitary': 'SANITAR',
        'sys.abbr.fire': 'INCENDIU',
        'sys.abbr.bms': 'BMS',
        'features.integrated.title': 'Execuție integrată',
        'features.integrated.sub':   'Un contract. Un interlocutor. 11 sisteme livrate.',
        'features.efficiency.title':  'Eficiență maximă',
        'features.efficiency.sub':    'Performanță ridicată. Risipă minimă.',
        'features.safe.title':        'Sigur și scalabil',
        'features.safe.sub':          'Construit pentru astăzi, pregătit pentru mâine.',
        'features.future.title':      'Pregătit pentru viitor',
        'features.future.sub':        'Soluții care susțin industria durabilă.',
        'process.label':      'Cum lucrăm',
        'process.heading':    'De la structură<br/>la hală funcțională.',
        'process.intro':      'Fiecare proiect urmează un proces structurat în șase etape — de la evaluarea inițială până la predarea documentației complete. Nicio improvizație, niciun compromis.',
        'process.scrollHint': 'Derulează pentru a vedea procesul',
        'spec.label':   'Specializări',
        'spec.heading': '11 sisteme.<br/>Un singur<br/>antreprenor',
        'spec.intro':   'Preluăm hala structural finalizată și o livrăm echipată complet. Fiecare sistem este proiectat, executat și testat de echipa noastră — sub un singur contract.',
        'spec.stat1':   'Specializări',
        'spec.stat2':   'Contract',
        'projects.label':   'Portofoliu',
        'projects.heading': 'Proiecte reprezentative',
        'projects.viewAll': 'Vezi toate',
        'cta.label':   'Hai să lucrăm împreună',
        'cta.heading': 'Vrei să echipăm hala ta?',
        'cta.sub':     'Spune-ne despre proiect. Revenim în 24 de ore.',
        'cta.btn':     'Contactează-ne',
        'footer.tagline':  'Echipare completă pentru hale industriale. De la structură la funcțional.',
        'footer.phone':    'Telefon',
        'footer.hq':       'Sediu',
        'footer.schedule': 'Program',
        'footer.form.label':     'Scrie-ne',
        'footer.form.title':     'Hai să discutăm<br/>despre proiectul tău.',
        'footer.form.name':      'Nume',
        'footer.form.namePh':    'Numele tău',
        'footer.form.company':   'Companie',
        'footer.form.companyPh': 'Firma ta',
        'footer.form.phone':     'Telefon',
        'footer.form.line':      'Linie de business',
        'footer.form.select':    'Selectează...',
        'footer.form.message':   'Mesaj',
        'footer.form.messagePh': 'Descrie pe scurt proiectul tău...',
        'footer.form.gdpr':      'Sunt de acord cu',
        'footer.form.gdprLink':  'prelucrarea datelor',
        'footer.form.submit':    'Trimite mesaj',
        'footer.form.success':   'Mulțumim! Te contactăm în 24 de ore.',
    },
    en: {
        'nav.halls': 'Industrial Halls',
        'nav.solar': 'Solar PV',
        'nav.heavy': 'Heavy Infrastructure',
        'nav.automation': 'Automation',
        'nav.about': 'About Us',
        'nav.cta': 'Get in touch',
        'hero.overline': 'Complete fitting · Industrial halls',
        'hero.headline1': 'We take empty halls.',
        'hero.headline2': 'We deliver working systems.',
        'sys.electric': 'Electrical Systems',
        'sys.hvac': 'HVAC & Climate',
        'sys.sanitary': 'Sanitary & Drainage',
        'sys.fire': 'Fire Suppression',
        'sys.bms': 'BMS & Automation',
        'sys.other': '+ other specialties',
        'sys.abbr.electric': 'ELECTRIC',
        'sys.abbr.hvac': 'HVAC',
        'sys.abbr.sanitary': 'SANITARY',
        'sys.abbr.fire': 'FIRE',
        'sys.abbr.bms': 'BMS',
        'features.integrated.title': 'Integrated execution',
        'features.integrated.sub':   'One contract. One point of contact. 11 systems delivered.',
        'features.efficiency.title':  'Maximum efficiency',
        'features.efficiency.sub':    'High performance. Minimal waste.',
        'features.safe.title':        'Safe & scalable',
        'features.safe.sub':          'Built for today, ready for tomorrow.',
        'features.future.title':      'Future-proof',
        'features.future.sub':        'Solutions that support sustainable industry.',
        'process.label':      'How we work',
        'process.heading':    'From structure<br/>to functional hall.',
        'process.intro':      'Every project follows a structured six-step process — from initial assessment to full documentation handover. No improvisation, no compromise.',
        'process.scrollHint': 'Scroll to see the process',
        'spec.label':   'Specializations',
        'spec.heading': '11 systems.<br/>One single<br/>contractor',
        'spec.intro':   'We take the structurally complete hall and deliver it fully equipped. Every system is designed, installed and tested by our team — under one contract.',
        'spec.stat1':   'Specializations',
        'spec.stat2':   'Contract',
        'projects.label':   'Portfolio',
        'projects.heading': 'Representative projects',
        'projects.viewAll': 'View all',
        'cta.label':   'Let\'s work together',
        'cta.heading': 'Want us to equip your hall?',
        'cta.sub':     'Tell us about your project. We get back within 24 hours.',
        'cta.btn':     'Contact us',
        'footer.tagline':  'Complete fitting for industrial halls. From structure to functional.',
        'footer.phone':    'Phone',
        'footer.hq':       'Office',
        'footer.schedule': 'Hours',
        'footer.form.label':     'Write to us',
        'footer.form.title':     'Let\'s talk about<br/>your project.',
        'footer.form.name':      'Name',
        'footer.form.namePh':    'Your name',
        'footer.form.company':   'Company',
        'footer.form.companyPh': 'Your company',
        'footer.form.phone':     'Phone',
        'footer.form.line':      'Business line',
        'footer.form.select':    'Select...',
        'footer.form.message':   'Message',
        'footer.form.messagePh': 'Briefly describe your project...',
        'footer.form.gdpr':      'I agree to the',
        'footer.form.gdprLink':  'data processing policy',
        'footer.form.submit':    'Send message',
        'footer.form.success':   'Thank you! We\'ll contact you within 24 hours.',
    },
};

const locale = ref(localStorage.getItem('ch_lang') || 'ro');
const translations = ref({ ...FALLBACK });

// Fetch Enso translations and merge for current locale.
// Enso's endpoint: GET /api/i18n returns { data: { key: value, ... } }
async function fetchEnsoTranslations(lang) {
    try {
        const res = await fetch(`/api/i18n?lang=${lang}`);
        if (!res.ok) return;
        const json = await res.json();
        const data = json.data ?? json;
        if (typeof data === 'object') {
            translations.value[lang] = { ...FALLBACK[lang], ...data };
        }
    } catch {
        // silently keep fallbacks
    }
}

function setLocale(lang) {
    locale.value = lang;
    localStorage.setItem('ch_lang', lang);
    fetchEnsoTranslations(lang);
}

function t(key) {
    return translations.value[locale.value]?.[key]
        ?? translations.value.ro?.[key]
        ?? key;
}

// Fetch on first import
fetchEnsoTranslations(locale.value);

export function useI18n() {
    const isRo = computed(() => locale.value === 'ro');

    function toggleLocale() {
        setLocale(locale.value === 'ro' ? 'en' : 'ro');
    }

    return { locale, isRo, t, setLocale, toggleLocale };
}
