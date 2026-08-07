import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from '../components/ProjectCard';
import { ContactForm } from '../components/ContactForm';
import { Reveal } from '../components/Reveal';
const services = [
  'Estrategia de marca',
  'Identidad visual',
  'Dirección de arte',
  'Diseño editorial',
  'Packaging',
  'Diseño digital',
  'Contenido para redes',
];
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
        <title>Maloba® — Branding e identidad visual</title>
        <meta
          name="description"
          content="Estudio creativo independiente especializado en estrategia de marca, branding, identidad visual y dirección de arte."
        />
        <meta property="og:title" content="Maloba® — Estudio creativo" />
        <meta
          property="og:description"
          content="Creamos identidades visuales para marcas que quieren ser recordadas."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <section className="hero">
        <div className="aurora" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="hero-top">
          <span>Estudio creativo independiente</span>
          <span>
            CDMX · MX
            <br />
            2026
          </span>
        </div>
        <h1>
          Creamos identidades visuales para marcas que quieren ser <em>recordadas.</em>
        </h1>
        <div className="hero-bottom">
          <p>
            Estrategia, dirección visual y sistemas de marca con ideas claras y una mirada sensible.
          </p>
          <a href="#projects">
            Explorar proyectos <ArrowDownRight />
          </a>
        </div>
        <div className="orbit-mark" aria-hidden="true">
          <span>20</span>
          <span>26</span>
        </div>
      </section>
      <section className="projects section-shell" id="projects">
        <Reveal className="section-heading">
          <p>01 — Trabajo seleccionado</p>
          <h2>
            Proyectos con una idea
            <br />
            <em>en el centro.</em>
          </h2>
        </Reveal>
        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>
      <section className="manifesto section-shell" id="studio">
        <Reveal>
          <p className="section-kicker">02 — El estudio</p>
          <div className="manifesto-grid">
            <h2>
              Diseñar es encontrar
              <br />
              la forma <em>precisa.</em>
            </h2>
            <div>
              <p>
                Somos un estudio independiente enfocado en identidad, dirección visual y sistemas de
                marca. Creamos conceptos claros, memorables y capaces de crecer con cada proyecto.
              </p>
              <p className="aside">
                Trabajamos de cerca con equipos pequeños, proyectos culturales y marcas en
                transformación.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
      <section className="services section-shell" id="services">
        <p className="section-kicker">03 — Lo que hacemos</p>
        <div className="service-list">
          {services.map((service, index) => (
            <Reveal key={service}>
              <div className="service-row">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{service}</h3>
                <span className="service-arrow">↗</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="contact" id="contact">
        <div className="contact-glow" aria-hidden="true" />
        <div className="contact-intro">
          <p>04 — Empecemos algo</p>
          <h2>
            ¿Tienes una marca, una idea o un proyecto en construcción? <em>Hablemos.</em>
          </h2>
          <div className="socials">
            <a href="mailto:hola@maloba.studio">hola@maloba.studio</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram ↗
            </a>
            <a href="https://behance.net" target="_blank" rel="noreferrer">
              Behance ↗
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </div>
        <ContactForm />
        <footer>
          <span>maloba®</span>
          <span>Identidades para recordar.</span>
          <span>© 2026</span>
        </footer>
      </section>
    </motion.main>
  );
}
