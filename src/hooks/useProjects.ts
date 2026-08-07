import { useEffect, useState } from 'react';
import { projects as fallbackProjects } from '../data/projects';
import type { Project } from '../types/project';

let cache: Project[] = fallbackProjects;
let requested = false;
const listeners = new Set<(projects: Project[]) => void>();

function notify(projects: Project[]) {
  cache = projects;
  listeners.forEach((listener) => listener(projects));
}

export async function refreshProjects() {
  const response = await fetch('/api/projects');
  if (!response.ok) throw new Error('No se pudieron cargar los proyectos');
  const projects = (await response.json()) as Project[];
  notify(projects);
  return projects;
}

export function useProjects() {
  const [projects, setProjects] = useState(cache);

  useEffect(() => {
    listeners.add(setProjects);
    if (!requested) {
      requested = true;
      refreshProjects().catch(() => {
        requested = false;
      });
    }
    return () => {
      listeners.delete(setProjects);
    };
  }, []);

  return projects;
}

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

export async function uploadCover(file: File) {
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

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
