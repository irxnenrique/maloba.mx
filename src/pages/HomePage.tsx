import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useProjects } from '../hooks/useProjects';
import { ContactSection } from '../sections/ContactSection';
import { HomeHero } from '../sections/HomeHero';
import { SelectedProjects } from '../sections/SelectedProjects';
import { ServicesSection } from '../sections/ServicesSection';
import { StudioManifesto } from '../sections/StudioManifesto';
import m, { common, getSelectedLanguage, hero } from '../i18n/messages';

export function HomePage() {
  const reduce = useReducedMotion();
  const projects = useProjects();
  const language = getSelectedLanguage();

  return (
    <motion.main
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? {} : { opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Helmet>
        <html lang={language} />
        <title>{m(common, 'seoTitle')}</title>
        <meta name="description" content={m(common, 'seoDescription')} />
        <meta property="og:title" content={m(common, 'ogTitle')} />
        <meta property="og:description" content={`${m(hero, 'headline')} ${m(hero, 'emphasis')}`} />
        <meta property="og:type" content="website" />
        <link rel="alternate" hrefLang="es" href="/es" />
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="x-default" href="/es" />
      </Helmet>

      <HomeHero />
      <SelectedProjects projects={projects} />
      <StudioManifesto />
      <ServicesSection />
      <ContactSection />
    </motion.main>
  );
}
