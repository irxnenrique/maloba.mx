import { ContactForm } from '@components/contact-form';
import { currentYear } from '@data/site';
import m, { contact } from '@i18n/messages';

export function ContactSection() {
  return (
    <section className="contact" id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="contact-intro">
        <p>{m(contact, 'kicker')}</p>
        <h2>
          {m(contact, 'title')} <em>{m(contact, 'emphasis')}</em>
        </h2>
        <div className="socials">
          <a
            href="https://api.whatsapp.com/send?phone=523329292250"
            target="_blank"
            rel="noreferrer"
            aria-label={m(contact, 'whatsappLabel')}
          >
            WhatsApp ↗
          </a>
          <a href="https://instagram.com/maloba.mx" target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        </div>
      </div>
      <ContactForm />
      <footer>
        <span>maloba®</span>
        <span>{m(contact, 'identityLine')}</span>
        <span>© {currentYear}</span>
      </footer>
    </section>
  );
}
