import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { Artwork } from '../components/Artwork';
import { ImageLightbox } from '../components/ImageLightbox';
import { Reveal } from '../components/Reveal';
import { NotFoundPage } from './NotFoundPage';
export function ProjectPage() {
  const { slug } = useParams();
  const projects = useProjects();
  const project = projects.find((item) => item.slug === slug);
  const reduce = useReducedMotion();
  const [activeImage, setActiveImage] = useState<number | null>(null);
  if (!project) return <NotFoundPage />;
  const index = projects.indexOf(project),
    prev = projects[(index - 1 + projects.length) % projects.length],
    next = projects[(index + 1) % projects.length];
  return (
    <motion.main
      className="case"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? {} : { opacity: 0 }}
    >
      <Helmet>
        <title>{project.name} — maloba®</title>
        <meta name="description" content={project.description} />
      </Helmet>
      <header className="case-header section-shell">
        <Link to="/#projects" className="back-link">
          <ArrowLeft /> Volver al portafolio
        </Link>
        <p>
          {project.category} · {project.year}
        </p>
        <h1>{project.name}</h1>
        <div className="case-intro">
          <p>{project.description}</p>
          <dl>
            <div>
              <dt>Cliente</dt>
              <dd>{project.client}</dd>
            </div>
            <div>
              <dt>Servicios</dt>
              <dd>{project.services.join(', ')}</dd>
            </div>
          </dl>
        </div>
      </header>
      <div className="case-hero">
        <Artwork
          kind={project.artwork}
          name={project.name}
          accent={project.accent}
          secondary={project.secondary}
          image={project.coverImage}
          variant="wide"
        />
      </div>
      <section className="case-story section-shell">
        <Reveal>
          <p className="section-kicker">01 — Contexto</p>
          <div className="story-row">
            <h2>
              El punto
              <br />
              <em>de partida.</em>
            </h2>
            <p>{project.context}</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="story-pair">
            <article>
              <span>El problema</span>
              <h3>{project.problem}</h3>
            </article>
            <article>
              <span>El concepto</span>
              <h3>{project.concept}</h3>
            </article>
          </div>
        </Reveal>
      </section>
      <section className="case-gallery section-shell">
        {project.galleryImages?.length ? (
          project.galleryImages.map((image, index) => (
            <Reveal
              key={`${image}-${index}`}
              className={`gallery-item gallery-item-${(index % 5) + 1}`}
            >
              <button
                className="gallery-image-button"
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`Ampliar imagen ${index + 1} de ${project.name}`}
              >
                <img
                  src={image}
                  alt={`${project.name}, imagen de galería ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </Reveal>
          ))
        ) : (
          <>
            <Artwork
              kind={project.artwork}
              name={project.name}
              accent={project.secondary}
              secondary={project.accent}
              variant="detail"
            />
            <Artwork
              kind={project.artwork}
              name={project.name}
              accent={project.accent}
              secondary="#f4efe5"
              variant="detail"
            />
          </>
        )}
      </section>
      <section className="solution section-shell">
        <p className="section-kicker">02 — La solución</p>
        <Reveal>
          <p>{project.solution}</p>
        </Reveal>
      </section>
      <nav className="project-nav section-shell" aria-label="Otros proyectos">
        <Link to={`/projects/${prev.slug}`}>
          <ArrowLeft />
          <span>
            Anterior<em>{prev.name}</em>
          </span>
        </Link>
        <Link to={`/projects/${next.slug}`}>
          <span>
            Siguiente<em>{next.name}</em>
          </span>
          <ArrowRight />
        </Link>
      </nav>
      <ImageLightbox
        images={project.galleryImages ?? []}
        activeIndex={activeImage}
        projectName={project.name}
        onChange={setActiveImage}
        onClose={() => setActiveImage(null)}
      />
    </motion.main>
  );
}
