import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import m, { caseStudy, getSelectedLanguage } from '@i18n/messages';
import type { Project } from '@app-types/project';

export function ProjectNavigation({ previous, next }: { previous: Project; next: Project }) {
  const language = getSelectedLanguage();
  return (
    <nav className="project-nav section-shell" aria-label={m(caseStudy, 'otherProjects')}>
      <Link to={`/${language}/projects/${previous.slug}`}>
        <ArrowLeft />
        <span>
          {m(caseStudy, 'previous')}
          <em>{previous.name}</em>
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
  );
}
