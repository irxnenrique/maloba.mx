import { useState, type FormEvent } from 'react';
type Fields = { name: string; email: string; message: string };
const empty = { name: '', email: '', message: '' };
export function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [sent, setSent] = useState(false);
  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Partial<Fields> = {};
    if (!fields.name.trim()) next.name = 'Escribe tu nombre.';
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) next.email = 'Escribe un correo válido.';
    if (fields.message.trim().length < 12)
      next.message = 'Cuéntanos un poco más (mínimo 12 caracteres).';
    setErrors(next);
    if (!Object.keys(next).length) {
      setSent(true);
      setFields(empty);
    }
  }
  if (sent)
    return (
      <div className="form-success" role="status">
        <span>Mensaje listo</span>
        <p>
          Gracias por escribirnos. Esta es una demo; conectaremos el envío cuando definas tu
          proveedor de correo.
        </p>
        <button onClick={() => setSent(false)}>Enviar otro mensaje</button>
      </div>
    );
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
        Correo
        <input
          type="email"
          value={fields.email}
          onChange={(e) => setFields({ ...fields, email: e.target.value })}
          aria-invalid={!!errors.email}
        />
        {errors.email && <small>{errors.email}</small>}
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
        Enviar mensaje <span>↗</span>
      </button>
    </form>
  );
}
