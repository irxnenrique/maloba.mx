import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { ArtworkKind, Project } from '@app-types/project';
import { saveProject, slugify, uploadProjectImage } from '@admin-page/utils/project-admin-api';

const blankForm = {
  name: '',
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

export type ProjectFormState = typeof blankForm;

export function useProjectForm() {
  const [form, setForm] = useState<ProjectFormState>(blankForm);
  const [originalSlug, setOriginalSlug] = useState('');
  const [error, setError] = useState('');
  const [publishedSlug, setPublishedSlug] = useState('');
  const [uploading, setUploading] = useState(false);
  const [draggedImage, setDraggedImage] = useState<number | null>(null);

  function update<K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setPublishedSlug('');
  }

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      update('coverImage', await uploadProjectImage(file));
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
      for (const file of files) uploaded.push(await uploadProjectImage(file));
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
    const requiredValues = [
      form.name,
      form.category,
      form.description,
      form.services,
      form.context,
      form.problem,
      form.concept,
      form.solution,
    ];
    if (requiredValues.some((value) => !value.trim())) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    const slug = originalSlug || slugify(form.name);
    try {
      await saveProject({
        ...form,
        slug,
        client: '',
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

  return {
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
  };
}
