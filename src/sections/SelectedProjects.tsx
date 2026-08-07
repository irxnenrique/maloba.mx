import { ProjectCard } from '../components/ProjectCard';
import { Reveal } from '../components/Reveal';
import type { Project } from '../types/project';
import { localizeProject } from '../i18n/projects';
import m, { getSelectedLanguage, projects as projectMessages } from '../i18n/messages';

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
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={localizeProject(project, language)}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
