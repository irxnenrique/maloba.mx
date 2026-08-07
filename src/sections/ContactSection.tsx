import { ContactForm } from '../components/ContactForm';
import { currentYear } from '../data/site';

export function ContactSection() {
  return (
    <section className="contact" id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="contact-intro">
        <p>04 — Empecemos algo</p>
        <h2>
          ¿Tienes una marca, una idea o un proyecto en construcción? <em>Hablemos.</em>
        </h2>
        <div className="socials">
          <a
            href="https://api.whatsapp.com/send?phone=523329292250"
            target="_blank"
            rel="noreferrer"
            aria-label="Enviar mensaje a maloba por WhatsApp"
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
        <span>Identidades para recordar.</span>
        <span>© {currentYear}</span>
      </footer>
    </section>
  );
}
