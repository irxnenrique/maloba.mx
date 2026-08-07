import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  ExternalLink,
  GripVertical,
  ImagePlus,
  LogOut,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Artwork } from '../components/Artwork';
import {
  removeProject,
  saveProject,
  slugify,
  uploadCover,
  useProjects,
} from '../hooks/useProjects';
import type { ArtworkKind, Project } from '../types/project';

const blankForm = {
  name: '',
  client: '',
  year: new Date().getFullYear().toString(),
  category: '',
  description: '',
  services: '',
  accent: '#d9ff45',
  secondary: '#8668ff',
  artwork: 'orbit' as ArtworkKind,
  context: '',
  problem: '',
  concept: '',
  solution: '',
  categoryEn: '',
  descriptionEn: '',
  servicesEn: '',
  contextEn: '',
  problemEn: '',
  conceptEn: '',
  solutionEn: '',
  coverImage: '',
  galleryImages: [] as string[],
};
type FormState = typeof blankForm;

export function AdminPage() {
  const [auth, setAuth] = useState<'loading' | 'guest' | 'admin'>('loading');

  useEffect(() => {
    fetch('/api/admin/session')
      .then((response) => response.json())
      .then((result) => setAuth(result.authenticated ? 'admin' : 'guest'))
      .catch(() => setAuth('guest'));
  }, []);

  return (
    <main className="admin-page">
      <Helmet>
        <title>Acceso privado — maloba®</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>
      {auth === 'loading' && <div className="admin-loading">Verificando acceso…</div>}
      {auth === 'guest' && <AdminLogin onSuccess={() => setAuth('admin')} />}
      {auth === 'admin' && <ProjectEditor onLogout={() => setAuth('guest')} />}
    </main>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Usuario o contraseña incorrectos.');
      onSuccess();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo iniciar sesión.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-login">
      <div className="admin-login-glow" aria-hidden="true" />
      <form onSubmit={submit}>
        <span>maloba® — Área privada</span>
        <h1>
          Acceso al
          <br />
          <em>estudio.</em>
        </h1>
        <label>
          Usuario
          <input
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button disabled={busy}>{busy ? 'Verificando…' : 'Entrar ↗'}</button>
      </form>
    </section>
  );
}

function ProjectEditor({ onLogout }: { onLogout: () => void }) {
  const projects = useProjects();
  const [form, setForm] = useState<FormState>(blankForm);
  const [originalSlug, setOriginalSlug] = useState('');
  const [error, setError] = useState('');
  const [publishedSlug, setPublishedSlug] = useState('');
  const [uploading, setUploading] = useState(false);
  const [draggedImage, setDraggedImage] = useState<number | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setPublishedSlug('');
  }

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      update('coverImage', await uploadCover(file));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo subir la imagen.');
    } finally {
      setUploading(false);
    }
  }

  async function handleGallery(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    try {
      const uploaded: string[] = [];
      for (const file of files) uploaded.push(await uploadCover(file));
      update('galleryImages', [...form.galleryImages, ...uploaded]);
      event.target.value = '';
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudieron subir las imágenes.');
    } finally {
      setUploading(false);
    }
  }

  function moveGalleryImage(from: number, to: number) {
    if (from === to || to < 0 || to >= form.galleryImages.length) return;
    setForm((current) => {
      const galleryImages = [...current.galleryImages];
      const [image] = galleryImages.splice(from, 1);
      galleryImages.splice(to, 0, image);
      return { ...current, galleryImages };
    });
    setPublishedSlug('');
  }

  function editProject(project: Project) {
    setForm({
      name: project.name,
      client: project.client,
      year: project.year,
      category: project.category,
      description: project.description,
      services: project.services.join(', '),
      accent: project.accent,
      secondary: project.secondary,
      artwork: project.artwork,
      context: project.context,
      problem: project.problem,
      concept: project.concept,
      solution: project.solution,
      categoryEn: project.categoryEn || '',
      descriptionEn: project.descriptionEn || '',
      servicesEn: project.servicesEn?.join(', ') || '',
      contextEn: project.contextEn || '',
      problemEn: project.problemEn || '',
      conceptEn: project.conceptEn || '',
      solutionEn: project.solutionEn || '',
      coverImage: project.coverImage || '',
      galleryImages: project.galleryImages || [],
    });
    setOriginalSlug(project.slug);
    setPublishedSlug('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const values = [
      form.name,
      form.client,
      form.category,
      form.description,
      form.services,
      form.context,
      form.problem,
      form.concept,
      form.solution,
    ];
    if (values.some((value) => !value.trim())) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    const slug = originalSlug || slugify(form.name);
    try {
      await saveProject({
        ...form,
        slug,
        services: form.services
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        servicesEn: form.servicesEn
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setPublishedSlug(slug);
      setForm(blankForm);
      setOriginalSlug('');
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo guardar el proyecto.');
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', headers: { 'x-maloba-admin': '1' } });
    onLogout();
  }

  return (
    <>
      <header className="admin-hero section-shell">
        <div className="admin-toolbar">
          <p className="section-kicker">Gestor privado — Proyectos</p>
          <button onClick={logout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
        <h1>
          {originalSlug ? 'Actualiza el' : 'Publica un nuevo'}
          <br />
          <em>caso de estudio.</em>
        </h1>
        <p>
          El contenido se guarda en la base de datos y estará disponible para todos los visitantes.
        </p>
      </header>

      <section className="admin-workspace section-shell">
        <form className="project-editor" onSubmit={submit} noValidate>
          <EditorSection title="01 — Información básica">
            <div className="editor-grid">
              <Field
                label="Nombre *"
                value={form.name}
                onChange={(value) => update('name', value)}
              />
              <Field
                label="Cliente *"
                value={form.client}
                onChange={(value) => update('client', value)}
              />
              <Field label="Año" value={form.year} onChange={(value) => update('year', value)} />
              <Field
                label="Categoría *"
                value={form.category}
                onChange={(value) => update('category', value)}
              />
            </div>
            <TextField
              label="Descripción breve *"
              value={form.description}
              onChange={(value) => update('description', value)}
              rows={3}
            />
            <Field
              label="Servicios separados por comas *"
              value={form.services}
              onChange={(value) => update('services', value)}
            />
          </EditorSection>

          <EditorSection title="02 — Dirección visual">
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
                    ? 'Cambiar portada'
                    : 'Subir portada opcional'}
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
          </EditorSection>

          <EditorSection title="03 — Caso de estudio">
            <TextField
              label="Contexto *"
              value={form.context}
              onChange={(value) => update('context', value)}
            />
            <TextField
              label="Problema *"
              value={form.problem}
              onChange={(value) => update('problem', value)}
            />
            <TextField
              label="Concepto creativo *"
              value={form.concept}
              onChange={(value) => update('concept', value)}
            />
            <TextField
              label="Solución *"
              value={form.solution}
              onChange={(value) => update('solution', value)}
            />
          </EditorSection>

          <EditorSection title="04 — Versión en inglés (opcional)">
            <p className="editor-language-note">
              Si un campo queda vacío, la página en inglés mostrará temporalmente su versión en
              español.
            </p>
            <Field
              label="Category"
              value={form.categoryEn}
              onChange={(value) => update('categoryEn', value)}
            />
            <TextField
              label="Short description"
              value={form.descriptionEn}
              onChange={(value) => update('descriptionEn', value)}
              rows={3}
            />
            <Field
              label="Services separated by commas"
              value={form.servicesEn}
              onChange={(value) => update('servicesEn', value)}
            />
            <TextField
              label="Context"
              value={form.contextEn}
              onChange={(value) => update('contextEn', value)}
            />
            <TextField
              label="Challenge"
              value={form.problemEn}
              onChange={(value) => update('problemEn', value)}
            />
            <TextField
              label="Creative concept"
              value={form.conceptEn}
              onChange={(value) => update('conceptEn', value)}
            />
            <TextField
              label="Solution"
              value={form.solutionEn}
              onChange={(value) => update('solutionEn', value)}
            />
          </EditorSection>

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
            {originalSlug ? 'Guardar cambios' : 'Publicar proyecto'} <span>↗</span>
          </button>
        </form>

        <aside className="editor-preview">
          <span>Vista previa</span>
          <Artwork
            kind={form.artwork}
            name={form.name || 'Nuevo proyecto'}
            accent={form.accent}
            secondary={form.secondary}
            image={form.coverImage}
          />
          <h2>{form.name || 'Nombre del proyecto'}</h2>
          <p>
            {form.category || 'Categoría'} · {form.year}
          </p>
          <div className="editor-preview-gallery-header">
            <span>Galería · orden actual</span>
            <small>{form.galleryImages.length} imágenes</small>
          </div>
          {form.galleryImages.length > 0 ? (
            <div className="editor-preview-gallery" aria-label="Vista previa de la galería">
              {form.galleryImages.map((image, index) => (
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
      </section>

      <section className="managed-projects section-shell">
        <div>
          <p className="section-kicker">Proyectos en la base</p>
          <h2>{projects.length.toString().padStart(2, '0')}</h2>
        </div>
        <div className="managed-list">
          {projects.map((project) => (
            <article key={project.slug}>
              <Link to={`/es/projects/${project.slug}`}>
                <span>{project.year}</span>
                <h3>{project.name}</h3>
                <ExternalLink size={18} />
              </Link>
              <button onClick={() => editProject(project)} aria-label={`Editar ${project.name}`}>
                <Edit3 size={18} />
              </button>
              <button
                onClick={async () => {
                  if (window.confirm(`¿Retirar ${project.name}?`))
                    await removeProject(project.slug);
                }}
                aria-label={`Retirar ${project.name}`}
              >
                <Trash2 size={18} />
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function EditorSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="editor-section">
      <span>{title}</span>
      {children}
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
function TextField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label>
      {label}
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
