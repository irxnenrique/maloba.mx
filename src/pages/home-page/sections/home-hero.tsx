import { ArrowDownRight } from 'lucide-react';
import { currentYear } from '@data/site';
import m, { hero } from '@i18n/messages';

export function HomeHero() {
  return (
    <section className="hero">
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="hero-top">
        <span>{m(hero, 'eyebrow')}</span>
        <span>
          GDL · MX
          <br />
          {currentYear}
        </span>
      </div>
      <h1>
        {m(hero, 'headline')} <em>{m(hero, 'emphasis')}</em>
      </h1>
      <div className="hero-bottom">
        <p>{m(hero, 'description')}</p>
        <a href="#projects">
          {m(hero, 'explore')} <ArrowDownRight />
        </a>
      </div>
      <div className="orbit-mark" aria-hidden="true">
        <span>{currentYear.slice(0, 2)}</span>
        <span>{currentYear.slice(2)}</span>
      </div>
    </section>
  );
}
