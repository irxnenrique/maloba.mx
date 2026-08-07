import { useEffect, useState } from 'react';
import { projects as fallbackProjects } from '@data/projects';
import type { Project } from '@app-types/project';

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
