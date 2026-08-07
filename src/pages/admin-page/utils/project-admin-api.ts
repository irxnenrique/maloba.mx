import { refreshProjects } from '@hooks/use-projects';
import type { Project } from '@app-types/project';

const adminHeaders = { 'Content-Type': 'application/json', 'x-maloba-admin': '1' };

export async function saveProject(project: Project) {
  const response = await fetch(`/api/admin/projects/${encodeURIComponent(project.slug)}`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify(project),
  });
  if (!response.ok) throw new Error((await response.json()).error || 'No se pudo guardar');
  await refreshProjects();
}

export async function removeProject(slug: string) {
  const response = await fetch(`/api/admin/projects/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
    headers: { 'x-maloba-admin': '1' },
  });
  if (!response.ok) throw new Error('No se pudo retirar el proyecto');
  await refreshProjects();
}

export async function reorderProjects(slugs: string[]) {
  const response = await fetch('/api/admin/projects-order', {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({ slugs }),
  });
  if (!response.ok) throw new Error((await response.json()).error || 'No se pudo guardar el orden');
  await refreshProjects();
}

export async function uploadProjectImage(file: File) {
  const body = new FormData();
  body.append('image', file);
  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'x-maloba-admin': '1' },
    body,
  });
  if (!response.ok) throw new Error((await response.json()).error || 'No se pudo subir');
  return (await response.json()).url as string;
}

export async function logoutAdmin() {
  await fetch('/api/admin/logout', {
    method: 'POST',
    headers: { 'x-maloba-admin': '1' },
  });
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
