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
import { localizeProject } from '../i18n/projects';
import m, { caseStudy, getSelectedLanguage } from '../i18n/messages';
export function ProjectPage() {
  const language = getSelectedLanguage();
  const { slug } = useParams();
  const projects = useProjects();
  const sourceProject = projects.find((item) => item.slug === slug);
  const reduce = useReducedMotion();
  const [activeImage, setActiveImage] = useState<number | null>(null);
  if (!sourceProject) return <NotFoundPage />;
  const project = localizeProject(sourceProject, language);
  const index = projects.indexOf(sourceProject),
    prev = localizeProject(projects[(index - 1 + projects.length) % projects.length], language),
    next = localizeProject(projects[(index + 1) % projects.length], language);
  return (
    <motion.main
      className="case"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? {} : { opacity: 0 }}
    >
      <Helmet>
        <html lang={language} />
        <title>{project.name} — maloba®</title>
        <meta name="description" content={project.description} />
        <link rel="alternate" hrefLang="es" href={`/es/projects/${project.slug}`} />
        <link rel="alternate" hrefLang="en" href={`/en/projects/${project.slug}`} />
      </Helmet>
      <header className="case-header section-shell">
        <Link to={`/${language}#projects`} className="back-link">
          <ArrowLeft /> {m(caseStudy, 'back')}
        </Link>
        <p>
          {project.category} · {project.year}
        </p>
        <h1>{project.name}</h1>
        <div className="case-intro">
          <p>{project.description}</p>
          <dl>
            <div>
              <dt>{m(caseStudy, 'client')}</dt>
              <dd>{project.client}</dd>
            </div>
            <div>
              <dt>{m(caseStudy, 'services')}</dt>
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
          <p className="section-kicker">{m(caseStudy, 'contextKicker')}</p>
          <div className="story-row">
            <h2>
              {m(caseStudy, 'contextTitle')}
              <br />
              <em>{m(caseStudy, 'contextEmphasis')}</em>
            </h2>
            <p>{project.context}</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="story-pair">
            <article>
              <span>{m(caseStudy, 'problem')}</span>
              <h3>{project.problem}</h3>
            </article>
            <article>
              <span>{m(caseStudy, 'concept')}</span>
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
                aria-label={`${m(caseStudy, 'enlarge')} ${index + 1} — ${project.name}`}
              >
                <img
                  src={image}
                  alt={`${project.name}, ${m(caseStudy, 'galleryImage')} ${index + 1}`}
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
        <p className="section-kicker">{m(caseStudy, 'solution')}</p>
        <Reveal>
          <p>{project.solution}</p>
        </Reveal>
      </section>
      <nav className="project-nav section-shell" aria-label={m(caseStudy, 'otherProjects')}>
        <Link to={`/${language}/projects/${prev.slug}`}>
          <ArrowLeft />
          <span>
            {m(caseStudy, 'previous')}
            <em>{prev.name}</em>
          </span>
        </Link>
        <Link to={`/${language}/projects/${next.slug}`}>
          <span>
            {m(caseStudy, 'next')}
            <em>{next.name}</em>
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
