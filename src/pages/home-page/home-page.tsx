import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useProjects } from '@hooks/use-projects';
import m, { common, getSelectedLanguage, hero } from '@i18n/messages';
import { ContactSection } from '@home-page/sections/contact-section';
import { HomeHero } from '@home-page/sections/home-hero';
import { SelectedProjects } from '@home-page/sections/selected-projects';
import { ServicesSection } from '@home-page/sections/services-section';
import { StudioManifesto } from '@home-page/sections/studio-manifesto';

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
