import { Artwork } from '@components/artwork';
import type { ArtworkKind } from '@app-types/project';

type ProjectPreviewProps = {
  name: string;
  year: string;
  category: string;
  accent: string;
  secondary: string;
  artwork: ArtworkKind;
  coverImage: string;
  galleryImages: string[];
};

export function ProjectPreview({
  name,
  year,
  category,
  accent,
  secondary,
  artwork,
  coverImage,
  galleryImages,
}: ProjectPreviewProps) {
  return (
    <aside className="editor-preview">
      <span>Vista previa</span>
      <Artwork
        kind={artwork}
        name={name || 'Nuevo proyecto'}
        accent={accent}
        secondary={secondary}
        year={year}
        image={coverImage}
      />
      <h2>{name || 'Nombre del proyecto'}</h2>
      <p>
        {category || 'Categoría'} · {year}
      </p>
      <div className="editor-preview-gallery-header">
        <span>Galería · orden actual</span>
        <small>{galleryImages.length} imágenes</small>
      </div>
      {galleryImages.length > 0 ? (
        <div className="editor-preview-gallery" aria-label="Vista previa de la galería">
          {galleryImages.map((image, index) => (
            <figure key={`${image}-preview-${index}`}>
              <img src={image} alt={`Posición ${index + 1} de la galería`} />
              <figcaption>{String(index + 1).padStart(2, '0')}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="editor-preview-empty">Agrega imágenes para visualizar su acomodo.</p>
      )}
    </aside>
  );
}
