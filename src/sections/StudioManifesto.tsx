import { Reveal } from '../components/Reveal';

export function StudioManifesto() {
  return (
    <section className="manifesto section-shell" id="studio">
      <Reveal>
        <p className="section-kicker">02 — El estudio</p>
        <div className="manifesto-grid">
          <h2>
            Diseñar es encontrar
            <br />
            la forma <em>precisa.</em>
          </h2>
          <div>
            <p>
              Somos un estudio independiente enfocado en identidad, dirección visual y sistemas de
              marca. Creamos conceptos claros, memorables y capaces de crecer con cada proyecto.
            </p>
            <p className="aside">
              Trabajamos de cerca con equipos pequeños, proyectos culturales y marcas en
              transformación.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
