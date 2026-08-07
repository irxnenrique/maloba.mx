import { useState, type FormEvent } from 'react';
type Fields = { name: string; message: string };
const empty = { name: '', message: '' };
const whatsappNumber = '523329292250';
export function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Partial<Fields> = {};
    if (!fields.name.trim()) next.name = 'Escribe tu nombre.';
    if (fields.message.trim().length < 12)
      next.message = 'Cuéntanos un poco más (mínimo 12 caracteres).';
    setErrors(next);
    if (!Object.keys(next).length) {
      const purpleHeart = '\u{1F49C}';
      const initialMessage = [
        `${purpleHeart} ¡Hola, maloba! Soy ${fields.name.trim()} y me gustaría contarte sobre un proyecto en el que estoy trabajando:`,
        '',
        fields.message.trim(),
        '',
        `Me encantaría platicarlo contigo. ¡Gracias! ${purpleHeart}`,
      ].join('\n');
      const encodedMessage = encodeURIComponent(initialMessage);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  }
  return (
    <form onSubmit={submit} noValidate>
      <label>
        Nombre
        <input
          value={fields.name}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
          aria-invalid={!!errors.name}
        />
        {errors.name && <small>{errors.name}</small>}
      </label>
      <label>
        Mensaje
        <textarea
          rows={4}
          value={fields.message}
          onChange={(e) => setFields({ ...fields, message: e.target.value })}
          aria-invalid={!!errors.message}
        />
        {errors.message && <small>{errors.message}</small>}
      </label>
      <button className="submit-button" type="submit">
        Continuar en WhatsApp <span>↗</span>
      </button>
      <p className="whatsapp-note">
        Al continuar se abrirá WhatsApp con tu mensaje listo para enviar. Nada se enviará
        automáticamente.
      </p>
    </form>
  );
}
