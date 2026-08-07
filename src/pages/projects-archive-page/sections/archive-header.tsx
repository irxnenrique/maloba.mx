import m, { archive } from '@i18n/messages';

export function ArchiveHeader({ projectCount }: { projectCount: number }) {
  return (
    <header className="archive-header">
      <p className="section-kicker">{m(archive, 'kicker')}</p>
      <h1>
        {m(archive, 'title')}
        <br />
        <em>{m(archive, 'emphasis')}</em>
      </h1>
      <p>{m(archive, 'count', { count: projectCount })}</p>
    </header>
  );
}
