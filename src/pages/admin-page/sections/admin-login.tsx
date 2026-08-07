import { useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Usuario o contraseña incorrectos.');
      onSuccess();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo iniciar sesión.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-login">
      <div className="admin-login-glow" aria-hidden="true" />
      <form onSubmit={submit}>
        <span>maloba® — Área privada</span>
        <h1>
          Acceso al
          <br />
          <em>estudio.</em>
        </h1>
        <label>
          Usuario
          <input
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button disabled={busy}>
          {busy ? (
            'Verificando…'
          ) : (
            <>
              Entrar <ArrowUpRight aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </section>
  );
}
