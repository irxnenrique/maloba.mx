import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
const links = [
  ['Proyectos', '/#projects'],
  ['Estudio', '/#studio'],
  ['Servicios', '/#services'],
  ['Contacto', '/#contact'],
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="maloba, inicio" onClick={() => setOpen(false)}>
        maloba<span>®</span>
      </Link>
      <button
        className="menu-button"
        aria-expanded={open}
        aria-controls="main-navigation"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        id="main-navigation"
        className={open ? 'nav open' : 'nav'}
        aria-label="Navegación principal"
      >
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <span className="nav-note">
          Estudio creativo
          <br />
          Guadalajara
        </span>
      </nav>
    </header>
  );
}
