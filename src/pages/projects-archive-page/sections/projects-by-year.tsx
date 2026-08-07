import type { Project } from '@app-types/project';
import { ArchiveProjectCard } from '@projects-archive-page/components/archive-project-card';

export function ProjectsByYear({ groups }: { groups: Map<string, Project[]> }) {
  return (
    <div className="archive-years">
      {[...groups.entries()].map(([year, projects]) => (
        <section className="archive-year" key={year} aria-labelledby={`year-${year}`}>
          <h2 id={`year-${year}`}>{year}</h2>
          <div className="archive-grid">
            {projects.map((project) => (
              <ArchiveProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
