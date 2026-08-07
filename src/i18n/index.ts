import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import caseStudyEn from './locales/en/caseStudy.json';
import commonEn from './locales/en/common.json';
import contactEn from './locales/en/contact.json';
import heroEn from './locales/en/hero.json';
import notFoundEn from './locales/en/notFound.json';
import projectsEn from './locales/en/projects.json';
import servicesEn from './locales/en/services.json';
import studioEn from './locales/en/studio.json';
import caseStudyEs from './locales/es/caseStudy.json';
import commonEs from './locales/es/common.json';
import contactEs from './locales/es/contact.json';
import heroEs from './locales/es/hero.json';
import notFoundEs from './locales/es/notFound.json';
import projectsEs from './locales/es/projects.json';
import servicesEs from './locales/es/services.json';
import studioEs from './locales/es/studio.json';

export type Language = 'es' | 'en';

export const namespaces = [
  'common',
  'hero',
  'projects',
  'studio',
  'services',
  'contact',
  'caseStudy',
  'notFound',
] as const;

const resources = {
  es: {
    common: commonEs,
    hero: heroEs,
    projects: projectsEs,
    studio: studioEs,
    services: servicesEs,
    contact: contactEs,
    caseStudy: caseStudyEs,
    notFound: notFoundEs,
  },
  en: {
    common: commonEn,
    hero: heroEn,
    projects: projectsEn,
    studio: studioEn,
    services: servicesEn,
    contact: contactEn,
    caseStudy: caseStudyEn,
    notFound: notFoundEn,
  },
};

export function languageFromPath(pathname: string): Language {
  return pathname.startsWith('/en') ? 'en' : 'es';
}

void i18n.use(initReactI18next).init({
  resources,
  lng: languageFromPath(window.location.pathname),
  fallbackLng: 'es',
  supportedLngs: ['es', 'en'],
  defaultNS: 'common',
  ns: namespaces,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
