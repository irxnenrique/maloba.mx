import type { ArtworkKind } from '@app-types/project';
export function Artwork({
  kind,
  name,
  accent,
  secondary,
  year,
  image,
  variant = 'cover',
}: {
  kind: ArtworkKind;
  name: string;
  accent: string;
  secondary: string;
  year: string;
  image?: string;
  variant?: 'cover' | 'detail' | 'wide';
}) {
  return (
    <div
      className={`artwork artwork--${kind} artwork--${variant}`}
      style={{ '--accent': accent, '--secondary': secondary } as React.CSSProperties}
      role="img"
      aria-label={`Composición visual provisional para ${name}`}
    >
      {image && <img className="art-image" src={image} alt="" />}
      <span className="art-noise" />
      <span className="art-shape a" />
      <span className="art-shape b" />
      <span className="art-shape c" />
      <span className="art-label">{name}</span>
      <span className="art-index">maloba® · {year}</span>
    </div>
  );
}
