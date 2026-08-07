import { Link } from 'react-router-dom';
export function NotFoundPage() {
  return (
    <main className="not-found">
      <p>Error 404</p>
      <h1>
        Esta página se fue
        <br />
        <em>a buscar ideas.</em>
      </h1>
      <Link to="/">Volver al estudio ↗</Link>
    </main>
  );
}
