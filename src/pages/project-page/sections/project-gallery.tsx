import { Artwork } from '@components/artwork';
import { Reveal } from '@components/reveal';
import m, { caseStudy } from '@i18n/messages';
import type { Project } from '@app-types/project';

type ProjectGalleryProps = {
  project: Project;
  onOpen: (index: number) => void;
};

export function ProjectGallery({ project, onOpen }: ProjectGalleryProps) {
  return (
    <section className="case-gallery section-shell">
      {project.galleryImages?.length ? (
        project.galleryImages.map((image, index) => (
          <Reveal
            key={`${image}-${index}`}
            className={`gallery-item gallery-item-${(index % 5) + 1}`}
          >
            <button
              className="gallery-image-button"
              type="button"
              onClick={() => onOpen(index)}
              aria-label={`${m(caseStudy, 'enlarge')} ${index + 1} — ${project.name}`}
            >
              <img
                src={image}
                alt={`${project.name}, ${m(caseStudy, 'galleryImage')} ${index + 1}`}
                loading="lazy"
                decoding="async"
              />
            </button>
          </Reveal>
        ))
      ) : (
        <>
          <Artwork
            kind={project.artwork}
            name={project.name}
            accent={project.secondary}
            secondary={project.accent}
            year={project.year}
            variant="detail"
          />
          <Artwork
            kind={project.artwork}
            name={project.name}
            accent={project.accent}
            secondary="#f4efe5"
            year={project.year}
            variant="detail"
          />
        </>
      )}
    </section>
  );
}
