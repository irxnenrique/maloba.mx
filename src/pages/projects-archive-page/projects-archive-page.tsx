import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useProjects } from '@hooks/use-projects';
import m, { archive, getSelectedLanguage } from '@i18n/messages';
import { localizeProject } from '@i18n/projects';
import { LoadMoreButton } from '@projects-archive-page/components/load-more-button';
import { ArchiveHeader } from '@projects-archive-page/sections/archive-header';
import { ProjectsByYear } from '@projects-archive-page/sections/projects-by-year';

const PAGE_SIZE = 10;

export function ProjectsArchivePage() {
  const reduce = useReducedMotion();
  const language = getSelectedLanguage();
  const projects = useProjects();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sortedProjects = projects
    .map((project, order) => ({ project: localizeProject(project, language), order }))
    .sort((a, b) => Number(b.project.year) - Number(a.project.year) || a.order - b.order)
    .map(({ project }) => project);
  const visibleProjects = sortedProjects.slice(0, visibleCount);
  const projectsByYear = visibleProjects.reduce((groups, project) => {
    const yearProjects = groups.get(project.year) || [];
    yearProjects.push(project);
    groups.set(project.year, yearProjects);
    return groups;
  }, new Map<string, typeof visibleProjects>());
  const hasMore = visibleCount < sortedProjects.length;

  return (
    <motion.main
      className="projects-archive section-shell"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? {} : { opacity: 0 }}
    >
      <Helmet>
        <html lang={language} />
        <title>{m(archive, 'seoTitle')}</title>
        <meta name="description" content={m(archive, 'seoDescription')} />
        <link rel="alternate" hrefLang="es" href="/es/projects" />
        <link rel="alternate" hrefLang="en" href="/en/projects" />
      </Helmet>

      <ArchiveHeader projectCount={sortedProjects.length} />
      {visibleProjects.length ? (
        <ProjectsByYear groups={projectsByYear} />
      ) : (
        <p className="archive-empty">{m(archive, 'empty')}</p>
      )}
      {hasMore ? (
        <LoadMoreButton onClick={() => setVisibleCount((current) => current + PAGE_SIZE)} />
      ) : (
        visibleProjects.length > PAGE_SIZE && (
          <p className="archive-complete">{m(archive, 'allLoaded')}</p>
        )
      )}
    </motion.main>
  );
}
