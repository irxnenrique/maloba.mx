import { ProjectCard } from '@components/project-card';
import { Reveal } from '@components/reveal';
import type { Project } from '@app-types/project';
import { localizeProject } from '@i18n/projects';
import m, { getSelectedLanguage, projects as projectMessages } from '@i18n/messages';
import { Link } from 'react-router-dom';

type SelectedProjectsProps = {
  projects: Project[];
};

export function SelectedProjects({ projects }: SelectedProjectsProps) {
  const language = getSelectedLanguage();
  return (
    <section className="projects section-shell" id="projects">
      <Reveal className="section-heading">
        <p>{m(projectMessages, 'kicker')}</p>
        <h2>
          {m(projectMessages, 'title')}
          <br />
          <em>{m(projectMessages, 'emphasis')}</em>
        </h2>
      </Reveal>
      <div className="project-grid">
        {projects.slice(0, 10).map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={localizeProject(project, language)}
            index={index}
          />
        ))}
      </div>
      <Link className="all-projects-link" to={`/${language}/projects`}>
        {m(projectMessages, 'viewAll')} <span>↗</span>
      </Link>
    </section>
  );
}
