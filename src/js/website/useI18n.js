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
        'nav.cta': 'Solicită ofertă',
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
    },
    en: {
        'nav.halls': 'Industrial Halls',
        'nav.solar': 'Solar PV',
        'nav.heavy': 'Heavy Infrastructure',
        'nav.automation': 'Automation',
        'nav.about': 'About Us',
        'nav.cta': 'Request a quote',
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
