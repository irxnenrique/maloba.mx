import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GripVertical,
  ImagePlus,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BilingualField, Field, FormSection } from '@components/forms';
import { useProjects } from '@hooks/use-projects';
import type { ArtworkKind } from '@app-types/project';
import { useProjectForm } from '@admin-page/hooks/use-project-form';
import { logoutAdmin } from '@admin-page/utils/project-admin-api';
import { AdminHeader } from '@admin-page/sections/admin-header';
import { ManagedProjects } from '@admin-page/sections/managed-projects';
import { ProjectPreview } from '@admin-page/sections/project-preview';

export function ProjectManager({ onLogout }: { onLogout: () => void }) {
  const projects = useProjects();
  const {
    form,
    originalSlug,
    error,
    setError,
    publishedSlug,
    uploading,
    draggedImage,
    setDraggedImage,
    update,
    handleImage,
    handleGallery,
    moveGalleryImage,
    editProject,
    submit,
  } = useProjectForm();

  async function logout() {
    await logoutAdmin();
    onLogout();
  }

  return (
    <>
      <AdminHeader editing={Boolean(originalSlug)} onLogout={logout} />

      <section className="admin-workspace section-shell">
        <form className="project-editor" onSubmit={submit} noValidate>
          <FormSection title="01 — Información básica" order={1}>
            <div className="editor-grid">
              <Field
                label="Nombre *"
                value={form.name}
                onChange={(value) => update('name', value)}
              />
              <Field label="Año" value={form.year} onChange={(value) => update('year', value)} />
            </div>
          </FormSection>

          <FormSection title="03 — Contenido en español e inglés" order={3}>
            <p className="editor-language-note">
              Completa ambas versiones en paralelo. El español es obligatorio; si el inglés queda
              vacío, se mostrará el texto en español como respaldo.
            </p>
            <BilingualField
              title="Categoría"
              spanishValue={form.category}
              englishValue={form.categoryEn}
              onSpanishChange={(value) => update('category', value)}
              onEnglishChange={(value) => update('categoryEn', value)}
            />
            <BilingualField
              title="Descripción breve"
              spanishValue={form.description}
              englishValue={form.descriptionEn}
              onSpanishChange={(value) => update('description', value)}
              onEnglishChange={(value) => update('descriptionEn', value)}
              rows={3}
            />
            <BilingualField
              title="Servicios separados por comas"
              spanishValue={form.services}
              englishValue={form.servicesEn}
              onSpanishChange={(value) => update('services', value)}
              onEnglishChange={(value) => update('servicesEn', value)}
            />
            <BilingualField
              title="Contexto"
              spanishValue={form.context}
              englishValue={form.contextEn}
              onSpanishChange={(value) => update('context', value)}
              onEnglishChange={(value) => update('contextEn', value)}
              rows={4}
            />
            <BilingualField
              title="Problema / Challenge"
              spanishValue={form.problem}
              englishValue={form.problemEn}
              onSpanishChange={(value) => update('problem', value)}
              onEnglishChange={(value) => update('problemEn', value)}
              rows={4}
            />
            <BilingualField
              title="Concepto creativo"
              spanishValue={form.concept}
              englishValue={form.conceptEn}
              onSpanishChange={(value) => update('concept', value)}
              onEnglishChange={(value) => update('conceptEn', value)}
              rows={4}
            />
            <BilingualField
              title="Solución"
              spanishValue={form.solution}
              englishValue={form.solutionEn}
              onSpanishChange={(value) => update('solution', value)}
              onEnglishChange={(value) => update('solutionEn', value)}
              rows={4}
            />
          </FormSection>

          <FormSection title="02 — Logo y dirección visual" order={2}>
            <div className="editor-grid visual-controls">
              <label>
                Color principal
                <input
                  type="color"
                  value={form.accent}
                  onChange={(event) => update('accent', event.target.value)}
                />
              </label>
              <label>
                Color secundario
                <input
                  type="color"
                  value={form.secondary}
                  onChange={(event) => update('secondary', event.target.value)}
                />
              </label>
              <label>
                Composición
                <select
                  value={form.artwork}
                  onChange={(event) => update('artwork', event.target.value as ArtworkKind)}
                >
                  <option value="orbit">Órbitas</option>
                  <option value="arch">Arco</option>
                  <option value="wave">Ondas</option>
                  <option value="stamp">Sello</option>
                  <option value="grid">Retícula</option>
                  <option value="type">Tipográfica</option>
                </select>
              </label>
            </div>
            <label className="image-upload">
              <ImagePlus />
              <span>
                {uploading
                  ? 'Subiendo…'
                  : form.coverImage
                    ? 'Cambiar logo o portada'
                    : 'Subir logo o portada opcional'}
              </span>
              <small>JPG, PNG o WebP · máximo 5 MB</small>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImage}
                disabled={uploading}
              />
            </label>
            <div className="gallery-editor">
              <label className="image-upload">
                <ImagePlus />
                <span>{uploading ? 'Subiendo imágenes…' : 'Agregar imágenes a la galería'}</span>
                <small>Selección múltiple · sin límite de cantidad · máximo 5 MB por archivo</small>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleGallery}
                  disabled={uploading}
                />
              </label>
              {form.galleryImages.length > 0 && (
                <>
                  <p className="gallery-order-note">
                    Arrastra las imágenes o usa las flechas. Guarda los cambios para conservar el
                    nuevo orden.
                  </p>
                  <div className="gallery-editor-grid">
                    {form.galleryImages.map((image, index) => (
                      <figure
                        key={`${image}-${index}`}
                        draggable
                        className={draggedImage === index ? 'is-dragging' : ''}
                        onDragStart={() => setDraggedImage(index)}
                        onDragEnd={() => setDraggedImage(null)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => {
                          if (draggedImage !== null) moveGalleryImage(draggedImage, index);
                          setDraggedImage(null);
                        }}
                      >
                        <img src={image} alt={`Galería ${index + 1}`} />
                        <figcaption>
                          <span>
                            <GripVertical className="drag-handle" size={15} aria-hidden="true" />
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="gallery-item-actions">
                            <button
                              type="button"
                              onClick={() => moveGalleryImage(index, index - 1)}
                              disabled={index === 0}
                              aria-label={`Mover imagen ${index + 1} hacia el inicio`}
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveGalleryImage(index, index + 1)}
                              disabled={index === form.galleryImages.length - 1}
                              aria-label={`Mover imagen ${index + 1} hacia el final`}
                            >
                              <ChevronRight size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                update(
                                  'galleryImages',
                                  form.galleryImages.filter(
                                    (_, imageIndex) => imageIndex !== index,
                                  ),
                                )
                              }
                              aria-label={`Quitar imagen ${index + 1}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </>
              )}
            </div>
          </FormSection>

          {error && (
            <p className="editor-error" role="alert">
              {error}
            </p>
          )}
          {publishedSlug && (
            <div className="publish-success" role="status">
              <Check /> Proyecto guardado.
              <Link to={`/es/projects/${publishedSlug}`}>
                Ver proyecto <ExternalLink size={16} />
              </Link>
            </div>
          )}
          <button className="publish-button" type="submit">
            {originalSlug ? 'Guardar cambios' : 'Publicar proyecto'}
            <ArrowUpRight aria-hidden="true" />
          </button>
        </form>

        <ProjectPreview
          name={form.name}
          year={form.year}
          category={form.category}
          accent={form.accent}
          secondary={form.secondary}
          artwork={form.artwork}
          coverImage={form.coverImage}
          galleryImages={form.galleryImages}
        />
      </section>

      <ManagedProjects projects={projects} onEdit={editProject} onError={setError} />
    </>
  );
}
