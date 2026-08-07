import { Link } from 'react-router-dom';
import m, { getSelectedLanguage, notFound } from '../i18n/messages';
export function NotFoundPage() {
  const language = getSelectedLanguage();
  return (
    <main className="not-found">
      <p>Error 404</p>
      <h1>
        {m(notFound, 'title')}
        <br />
        <em>{m(notFound, 'emphasis')}</em>
      </h1>
      <Link to={`/${language}`}>{m(notFound, 'back')} ↗</Link>
    </main>
  );
}
