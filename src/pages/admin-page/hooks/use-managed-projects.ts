import { useState } from 'react';
import type { Project } from '@app-types/project';
import { reorderProjects } from '@admin-page/utils/project-admin-api';

const PROJECTS_PER_PAGE = 15;

export function useManagedProjects(projects: Project[], onError: (message: string) => void) {
  const [reordering, setReordering] = useState(false);
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(projects.length / PROJECTS_PER_PAGE));
  const activePage = Math.min(page, totalPages);
  const pageStart = (activePage - 1) * PROJECTS_PER_PAGE;
  const pageEnd = Math.min(pageStart + PROJECTS_PER_PAGE, projects.length);
  const visibleProjects = projects.slice(pageStart, pageEnd);

  async function moveProject(from: number, to: number) {
    if (from === to || to < 0 || to >= projects.length || reordering) return;
    const orderedProjects = [...projects];
    const [project] = orderedProjects.splice(from, 1);
    orderedProjects.splice(to, 0, project);
    setReordering(true);
    onError('');
    try {
      await reorderProjects(orderedProjects.map(({ slug }) => slug));
    } catch (reason) {
      onError(reason instanceof Error ? reason.message : 'No se pudo guardar el orden.');
    } finally {
      setReordering(false);
    }
  }

  return {
    activePage,
    totalPages,
    pageStart,
    pageEnd,
    visibleProjects,
    reordering,
    setPage,
    moveProject,
  };
}
