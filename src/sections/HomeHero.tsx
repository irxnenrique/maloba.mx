import { ArrowDownRight } from 'lucide-react';
import { currentYear } from '../data/site';

export function HomeHero() {
  return (
    <section className="hero">
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="hero-top">
        <span>Estudio creativo independiente</span>
        <span>
          GDL · MX
          <br />
          {currentYear}
        </span>
      </div>
      <h1>
        Creamos identidades visuales para marcas que quieren ser <em>recordadas.</em>
      </h1>
      <div className="hero-bottom">
        <p>
          Estrategia, dirección visual y sistemas de marca con ideas claras y una mirada sensible.
        </p>
        <a href="#projects">
          Explorar proyectos <ArrowDownRight />
        </a>
      </div>
      <div className="orbit-mark" aria-hidden="true">
        <span>{currentYear.slice(0, 2)}</span>
        <span>{currentYear.slice(2)}</span>
      </div>
    </section>
  );
}
