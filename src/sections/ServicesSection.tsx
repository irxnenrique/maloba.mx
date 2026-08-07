import m, { services } from '../i18n/messages';

export function ServicesSection() {
  const items = m(services, 'items');
  return (
    <section className="services section-shell" id="services">
      <p className="section-kicker">{m(services, 'kicker')}</p>
      <div className="service-list">
        {items.map((service, index) => (
          <div className="service-row" key={service}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{service}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
