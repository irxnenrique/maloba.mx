import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '../types/project';
import { Artwork } from './Artwork';
import m, { common, getSelectedLanguage } from '../i18n/messages';
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();
  const language = getSelectedLanguage();
  return (
    <motion.article
      className={`project-card card-${index + 1}`}
      whileHover={reduce ? {} : { y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        to={`/${language}/projects/${project.slug}`}
        aria-label={`${m(common, 'viewProject')} ${project.name}`}
      >
        <Artwork
          kind={project.artwork}
          name={project.name}
          accent={project.accent}
          secondary={project.secondary}
          image={project.coverImage}
        />
        <div className="card-meta">
          <div>
            <h3>{project.name}</h3>
            <p>{project.category}</p>
          </div>
          <span>
            {project.year}
            <ArrowUpRight size={18} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
