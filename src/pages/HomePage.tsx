import { motion, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useProjects } from '../hooks/useProjects';
import { ContactSection } from '../sections/ContactSection';
import { HomeHero } from '../sections/HomeHero';
import { SelectedProjects } from '../sections/SelectedProjects';
import { ServicesSection } from '../sections/ServicesSection';
import { StudioManifesto } from '../sections/StudioManifesto';

export function HomePage() {
  const reduce = useReducedMotion();
  const projects = useProjects();

  return (
    <motion.main
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? {} : { opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Helmet>
        <title>maloba® — Branding e identidad visual</title>
        <meta
          name="description"
          content="Estudio creativo independiente especializado en estrategia de marca, branding, identidad visual y dirección de arte."
        />
        <meta property="og:title" content="maloba® — Estudio creativo" />
        <meta
          property="og:description"
          content="Creamos identidades visuales para marcas que quieren ser recordadas."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <HomeHero />
      <SelectedProjects projects={projects} />
      <StudioManifesto />
      <ServicesSection />
      <ContactSection />
    </motion.main>
  );
}
