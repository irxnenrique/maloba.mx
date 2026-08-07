import { Reveal } from '@components/reveal';
import m, { caseStudy } from '@i18n/messages';
import type { Project } from '@app-types/project';

export function ProjectStory({ project }: { project: Project }) {
  return (
    <section className="case-story section-shell">
      <Reveal>
        <p className="section-kicker">{m(caseStudy, 'contextKicker')}</p>
        <div className="story-row">
          <h2>
            {m(caseStudy, 'contextTitle')}
            <br />
            <em>{m(caseStudy, 'contextEmphasis')}</em>
          </h2>
          <p>{project.context}</p>
        </div>
      </Reveal>
      <Reveal>
        <div className="story-pair">
          <article>
            <span>{m(caseStudy, 'problem')}</span>
            <h3>{project.problem}</h3>
          </article>
          <article>
            <span>{m(caseStudy, 'concept')}</span>
            <h3>{project.concept}</h3>
          </article>
        </div>
      </Reveal>
    </section>
  );
}
