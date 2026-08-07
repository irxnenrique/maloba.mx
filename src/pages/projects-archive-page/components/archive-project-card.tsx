import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Artwork } from '@components/artwork';
import m, { archive, getSelectedLanguage } from '@i18n/messages';
import type { Project } from '@app-types/project';

export function ArchiveProjectCard({ project }: { project: Project }) {
  const language = getSelectedLanguage();
  return (
    <article className="archive-card">
      <Link
        to={`/${language}/projects/${project.slug}`}
        aria-label={`${m(archive, 'viewProject')} ${project.name}`}
      >
        <Artwork
          kind={project.artwork}
          name={project.name}
          accent={project.accent}
          secondary={project.secondary}
          year={project.year}
          image={project.coverImage}
        />
        <div className="archive-card-meta">
          <div>
            <h3>{project.name}</h3>
            <p>{project.category}</p>
          </div>
          <ArrowUpRight aria-hidden="true" />
        </div>
      </Link>
    </article>
  );
}
