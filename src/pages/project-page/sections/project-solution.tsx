import { Reveal } from '@components/reveal';
import m, { caseStudy } from '@i18n/messages';
import type { Project } from '@app-types/project';

export function ProjectSolution({ project }: { project: Project }) {
  return (
    <section className="solution section-shell">
      <p className="section-kicker">{m(caseStudy, 'solution')}</p>
      <Reveal>
        <p>{project.solution}</p>
      </Reveal>
    </section>
  );
}
