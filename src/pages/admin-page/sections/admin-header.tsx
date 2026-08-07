import { LogOut } from 'lucide-react';

type AdminHeaderProps = {
  editing: boolean;
  onLogout: () => void;
};

export function AdminHeader({ editing, onLogout }: AdminHeaderProps) {
  return (
    <header className="admin-hero section-shell">
      <div className="admin-toolbar">
        <p className="section-kicker">Gestor privado — Proyectos</p>
        <button onClick={onLogout}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
      <h1>
        {editing ? 'Actualiza el' : 'Publica un nuevo'}
        <br />
        <em>caso de estudio.</em>
      </h1>
      <p>
        El contenido se guarda en la base de datos y estará disponible para todos los visitantes.
      </p>
    </header>
  );
}
