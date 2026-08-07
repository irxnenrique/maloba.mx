import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import m, { caseStudy, getSelectedLanguage } from '@i18n/messages';
import type { Project } from '@app-types/project';

export function ProjectHeader({ project }: { project: Project }) {
  const language = getSelectedLanguage();
  return (
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
            <dt>{m(caseStudy, 'services')}</dt>
            <dd>{project.services.join(', ')}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
