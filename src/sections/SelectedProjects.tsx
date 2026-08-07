import { ProjectCard } from '../components/ProjectCard';
import { Reveal } from '../components/Reveal';
import type { Project } from '../types/project';

type SelectedProjectsProps = {
  projects: Project[];
};

export function SelectedProjects({ projects }: SelectedProjectsProps) {
  return (
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
  );
}
