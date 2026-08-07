import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLogin } from '@admin-page/sections/admin-login';
import { ProjectManager } from '@admin-page/sections/project-manager';

export function AdminPage() {
  const [auth, setAuth] = useState<'loading' | 'guest' | 'admin'>('loading');

  useEffect(() => {
    fetch('/api/admin/session')
      .then((response) => response.json())
      .then((result) => setAuth(result.authenticated ? 'admin' : 'guest'))
      .catch(() => setAuth('guest'));
  }, []);

  return (
    <main className="admin-page">
      <Helmet>
        <title>Acceso privado — maloba®</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>
      {auth === 'loading' && <div className="admin-loading">Verificando acceso…</div>}
      {auth === 'guest' && <AdminLogin onSuccess={() => setAuth('admin')} />}
      {auth === 'admin' && <ProjectManager onLogout={() => setAuth('guest')} />}
    </main>
  );
}
