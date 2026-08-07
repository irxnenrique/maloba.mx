import m, { archive } from '@i18n/messages';

export function LoadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="archive-load-more" type="button" onClick={onClick}>
      {m(archive, 'loadMore')} <span>↓</span>
    </button>
  );
}
