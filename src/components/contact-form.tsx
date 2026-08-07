import { useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import m, { contact } from '@i18n/messages';
type Fields = { name: string; message: string };
const empty = { name: '', message: '' };
const whatsappNumber = '523329292250';
export function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Partial<Fields> = {};
    if (!fields.name.trim()) next.name = m(contact, 'nameError');
    if (fields.message.trim().length < 12) next.message = m(contact, 'messageError');
    setErrors(next);
    if (!Object.keys(next).length) {
      const initialMessage = [
        m(contact, 'whatsappIntro', { name: fields.name.trim() }),
        '',
        fields.message.trim(),
        '',
        m(contact, 'whatsappClosing'),
      ].join('\n');
      const encodedMessage = encodeURIComponent(initialMessage);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  }
  return (
    <form onSubmit={submit} noValidate>
      <label>
        {m(contact, 'name')}
        <input
          value={fields.name}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
          aria-invalid={!!errors.name}
        />
        {errors.name && <small>{errors.name}</small>}
      </label>
      <label>
        {m(contact, 'message')}
        <textarea
          rows={4}
          value={fields.message}
          onChange={(e) => setFields({ ...fields, message: e.target.value })}
          aria-invalid={!!errors.message}
        />
        {errors.message && <small>{errors.message}</small>}
      </label>
      <button className="submit-button" type="submit">
        {m(contact, 'submit')} <ArrowUpRight aria-hidden="true" />
      </button>
      <p className="whatsapp-note">{m(contact, 'note')}</p>
    </form>
  );
}
