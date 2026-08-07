import { services } from '../data/site';

export function ServicesSection() {
  return (
    <section className="services section-shell" id="services">
      <p className="section-kicker">03 — Lo que hacemos</p>
      <div className="service-list">
        {services.map((service, index) => (
          <div className="service-row" key={service}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{service}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
