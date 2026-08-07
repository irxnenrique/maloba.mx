import type { Project } from '../types/project';
import type { Language } from '.';

export function localizeProject(project: Project, language: Language): Project {
  if (language === 'es') return project;

  const services = project.servicesEn?.filter(Boolean) || [];
  if (!services.length) services.push(...project.services);

  return {
    ...project,
    category: project.categoryEn || project.category,
    description: project.descriptionEn || project.description,
    services,
    context: project.contextEn || project.context,
    problem: project.problemEn || project.problem,
    concept: project.conceptEn || project.concept,
    solution: project.solutionEn || project.solution,
  };
}
