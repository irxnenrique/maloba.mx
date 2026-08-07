import { Reveal } from '../components/Reveal';
import m, { studio } from '../i18n/messages';

export function StudioManifesto() {
  return (
    <section className="manifesto section-shell" id="studio">
      <Reveal>
        <p className="section-kicker">{m(studio, 'kicker')}</p>
        <div className="manifesto-grid">
          <h2>
            {m(studio, 'title')}
            <br />
            <em>{m(studio, 'emphasis')}</em>
          </h2>
          <div>
            <p>{m(studio, 'manifesto')}</p>
            <p className="aside">{m(studio, 'aside')}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
