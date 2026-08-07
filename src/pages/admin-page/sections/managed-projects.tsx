import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Edit3,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { removeProject } from '@admin-page/utils/project-admin-api';
import { useManagedProjects } from '@admin-page/hooks/use-managed-projects';
import type { Project } from '@app-types/project';

type ManagedProjectsProps = {
  projects: Project[];
  onEdit: (project: Project) => void;
  onError: (message: string) => void;
};

export function ManagedProjects({ projects, onEdit, onError }: ManagedProjectsProps) {
  const {
    activePage,
    totalPages,
    pageStart,
    pageEnd,
    visibleProjects,
    reordering,
    setPage,
    moveProject,
  } = useManagedProjects(projects, onError);

  return (
    <section className="managed-projects section-shell" aria-labelledby="managed-title">
      <header className="managed-projects-header">
        <div>
          <p className="section-kicker">Administración</p>
          <h2 id="managed-title">Proyectos</h2>
        </div>
        <div className="managed-summary">
          <strong>{projects.length}</strong> registros
          <span>Los primeros 10 se muestran en el home.</span>
        </div>
      </header>

      <div className="managed-table-wrap">
        <table className="managed-table">
          <thead>
            <tr>
              <th scope="col">Posición</th>
              <th scope="col">Proyecto</th>
              <th scope="col">Año</th>
              <th scope="col">Orden</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibleProjects.map((project, pageIndex) => {
              const index = pageStart + pageIndex;
              return (
                <tr key={project.slug}>
                  <td>
                    <span className={index < 10 ? 'home-position is-visible' : 'home-position'}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td>
                    <Link className="managed-project-link" to={`/es/projects/${project.slug}`}>
                      {project.name} <ExternalLink size={14} aria-hidden="true" />
                    </Link>
                  </td>
                  <td>{project.year}</td>
                  <td>
                    <div className="managed-order-actions">
                      <button
                        type="button"
                        onClick={() => moveProject(index, index - 1)}
                        disabled={index === 0 || reordering}
                        aria-label={`Mover ${project.name} hacia arriba`}
                      >
                        <ArrowUp size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProject(index, index + 1)}
                        disabled={index === projects.length - 1 || reordering}
                        aria-label={`Mover ${project.name} hacia abajo`}
                      >
                        <ArrowDown size={17} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="managed-row-actions">
                      <button type="button" onClick={() => onEdit(project)}>
                        <Edit3 size={16} /> Editar
                      </button>
                      <button
                        type="button"
                        className="is-danger"
                        onClick={async () => {
                          if (window.confirm(`¿Retirar ${project.name}?`)) {
                            await removeProject(project.slug);
                          }
                        }}
                      >
                        <Trash2 size={16} /> Retirar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <nav className="managed-pagination" aria-label="Paginación de proyectos">
        <p>
          Mostrando {projects.length ? pageStart + 1 : 0}–{pageEnd} de {projects.length}
        </p>
        <div>
          <button type="button" onClick={() => setPage(activePage - 1)} disabled={activePage === 1}>
            <ChevronLeft size={17} /> Anterior
          </button>
          <span>
            Página {activePage} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(activePage + 1)}
            disabled={activePage === totalPages}
          >
            Siguiente <ChevronRight size={17} />
          </button>
        </div>
      </nav>
    </section>
  );
}
