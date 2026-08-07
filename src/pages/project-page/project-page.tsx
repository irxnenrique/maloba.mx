import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Artwork } from '@components/artwork';
import { ImageLightbox } from '@components/image-lightbox';
import { useProjects } from '@hooks/use-projects';
import { getSelectedLanguage } from '@i18n/messages';
import { localizeProject } from '@i18n/projects';
import { NotFoundPage } from '@not-found-page';
import { ProjectGallery } from '@project-page/sections/project-gallery';
import { ProjectHeader } from '@project-page/sections/project-header';
import { ProjectNavigation } from '@project-page/sections/project-navigation';
import { ProjectSolution } from '@project-page/sections/project-solution';
import { ProjectStory } from '@project-page/sections/project-story';

export function ProjectPage() {
  const language = getSelectedLanguage();
  const { slug } = useParams();
  const projects = useProjects();
  const sourceProject = projects.find((item) => item.slug === slug);
  const reduce = useReducedMotion();
  const [activeImage, setActiveImage] = useState<number | null>(null);

  if (!sourceProject) return <NotFoundPage />;

  const project = localizeProject(sourceProject, language);
  const index = projects.indexOf(sourceProject);
  const previous = localizeProject(
    projects[(index - 1 + projects.length) % projects.length],
    language,
  );
  const next = localizeProject(projects[(index + 1) % projects.length], language);

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

      <ProjectHeader project={project} />
      <div className="case-hero">
        <Artwork
          kind={project.artwork}
          name={project.name}
          accent={project.accent}
          secondary={project.secondary}
          year={project.year}
          image={project.coverImage}
          variant="wide"
        />
      </div>
      <ProjectStory project={project} />
      <ProjectGallery project={project} onOpen={setActiveImage} />
      <ProjectSolution project={project} />
      <ProjectNavigation previous={previous} next={next} />
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
