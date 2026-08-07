import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Language } from '@i18n/index';
import m, { common, getSelectedLanguage } from '@i18n/messages';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const language = getSelectedLanguage();
  const labels = m(common, 'nav');
  const destinations = [
    `/${language}/projects`,
    `/${language}#studio`,
    `/${language}#services`,
    `/${language}#contact`,
  ];

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function languagePath(nextLanguage: Language) {
    const localizedPath = location.pathname.replace(/^\/(es|en)/, `/${nextLanguage}`);
    return localizedPath === location.pathname && !/^\/(es|en)/.test(location.pathname)
      ? `/${nextLanguage}`
      : localizedPath;
  }

  function currentLanguage(languageOption: Language) {
    if (language === languageOption) return 'page' as const;
    return undefined;
  }

  return (
    <header className={open ? 'site-header menu-open' : 'site-header'}>
      <Link
        to={`/${language}`}
        className="brand"
        aria-label={m(common, 'homeLabel')}
        onClick={() => setOpen(false)}
      >
        maloba<span>®</span>
      </Link>
      <button
        className="menu-button"
        aria-expanded={open}
        aria-controls="main-navigation"
        aria-label={m(common, open ? 'closeMenu' : 'openMenu')}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        id="main-navigation"
        className={open ? 'nav open' : 'nav'}
        aria-label={m(common, 'navLabel')}
      >
        {labels.map((label, index) => (
          <a key={destinations[index]} href={destinations[index]} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <div className="language-switcher" aria-label={m(common, 'changeLanguage')}>
          <Link
            to={`${languagePath('es')}${location.hash}`}
            aria-current={currentLanguage('es')}
            onClick={() => setOpen(false)}
          >
            ES
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            to={`${languagePath('en')}${location.hash}`}
            aria-current={currentLanguage('en')}
            onClick={() => setOpen(false)}
          >
            EN
          </Link>
        </div>
        <span className="nav-note">
          {m(common, 'studio')}
          <br />
          {m(common, 'city')}
        </span>
      </nav>
    </header>
  );
}
