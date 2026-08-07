import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import session from 'express-session';
import { seedProjects } from './seed-projects.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const storageRoot = process.env.STORAGE_ROOT ? path.resolve(process.env.STORAGE_ROOT) : root;
const dataDirectory = path.join(storageRoot, 'data');
fs.mkdirSync(dataDirectory, { recursive: true });

export const databasePath = path.join(dataDirectory, 'maloba.db');
export const database = new Database(databasePath);
database.pragma('journal_mode = WAL');
database.pragma('foreign_keys = ON');

database.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    client TEXT NOT NULL,
    year TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    services TEXT NOT NULL,
    accent TEXT NOT NULL,
    secondary TEXT NOT NULL,
    artwork TEXT NOT NULL,
    context TEXT NOT NULL,
    problem TEXT NOT NULL,
    concept TEXT NOT NULL,
    solution TEXT NOT NULL,
    cover_image TEXT,
    gallery_images TEXT NOT NULL DEFAULT '[]',
    category_en TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    services_en TEXT NOT NULL DEFAULT '[]',
    context_en TEXT NOT NULL DEFAULT '',
    problem_en TEXT NOT NULL DEFAULT '',
    concept_en TEXT NOT NULL DEFAULT '',
    solution_en TEXT NOT NULL DEFAULT '',
    home_order INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    sess TEXT NOT NULL,
    expired_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS app_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS sessions_expired_idx ON sessions(expired_at);
`);

const projectColumns = database.prepare('PRAGMA table_info(projects)').all();
const projectMigrations = {
  gallery_images: "TEXT NOT NULL DEFAULT '[]'",
  category_en: "TEXT NOT NULL DEFAULT ''",
  description_en: "TEXT NOT NULL DEFAULT ''",
  services_en: "TEXT NOT NULL DEFAULT '[]'",
  context_en: "TEXT NOT NULL DEFAULT ''",
  problem_en: "TEXT NOT NULL DEFAULT ''",
  concept_en: "TEXT NOT NULL DEFAULT ''",
  solution_en: "TEXT NOT NULL DEFAULT ''",
  home_order: 'INTEGER',
};
for (const [column, definition] of Object.entries(projectMigrations)) {
  if (!projectColumns.some((existing) => existing.name === column)) {
    database.prepare(`ALTER TABLE projects ADD COLUMN ${column} ${definition}`).run();
  }
}

const insertSeed = database.prepare(`
  INSERT OR IGNORE INTO projects (
    slug, name, client, year, category, description, services, accent, secondary,
    artwork, context, problem, concept, solution
  ) VALUES (
    @slug, @name, @client, @year, @category, @description, @services, @accent,
    @secondary, @artwork, @context, @problem, @concept, @solution
  )
`);

const initialSeed = database.prepare("SELECT value FROM app_meta WHERE key = 'initial_seed'").get();
if (!initialSeed) {
  database.transaction(() => {
    const projectCount = database.prepare('SELECT COUNT(*) AS count FROM projects').get().count;
    if (projectCount === 0) {
      for (const project of seedProjects) {
        insertSeed.run({ ...project, services: JSON.stringify(project.services) });
      }
    }
    database.prepare("INSERT INTO app_meta (key, value) VALUES ('initial_seed', 'complete')").run();
  })();
}

const unorderedProjects = database
  .prepare(
    'SELECT slug FROM projects WHERE home_order IS NULL ORDER BY CAST(year AS INTEGER) DESC, created_at DESC, rowid ASC',
  )
  .all();
if (unorderedProjects.length) {
  const nextOrder = database
    .prepare('SELECT COALESCE(MAX(home_order), -1) + 1 AS value FROM projects')
    .get().value;
  const setOrder = database.prepare('UPDATE projects SET home_order = ? WHERE slug = ?');
  database.transaction(() => {
    unorderedProjects.forEach((project, index) => setOrder.run(nextOrder + index, project.slug));
  })();
}

export function rowToProject(row) {
  return {
    slug: row.slug,
    name: row.name,
    client: row.client,
    year: row.year,
    category: row.category,
    description: row.description,
    services: JSON.parse(row.services),
    accent: row.accent,
    secondary: row.secondary,
    artwork: row.artwork,
    context: row.context,
    problem: row.problem,
    concept: row.concept,
    solution: row.solution,
    coverImage: row.cover_image || undefined,
    galleryImages: JSON.parse(row.gallery_images || '[]'),
    categoryEn: row.category_en || '',
    descriptionEn: row.description_en || '',
    servicesEn: JSON.parse(row.services_en || '[]'),
    contextEn: row.context_en || '',
    problemEn: row.problem_en || '',
    conceptEn: row.concept_en || '',
    solutionEn: row.solution_en || '',
    homeOrder: row.home_order,
  };
}

export class SQLiteSessionStore extends session.Store {
  get(sid, callback) {
    try {
      const row = database
        .prepare('SELECT sess FROM sessions WHERE sid = ? AND expired_at > ?')
        .get(sid, Date.now());
      callback(null, row ? JSON.parse(row.sess) : null);
    } catch (error) {
      callback(error);
    }
  }

  set(sid, value, callback = () => {}) {
    try {
      const expires = value.cookie?.expires
        ? new Date(value.cookie.expires).getTime()
        : Date.now() + 28_800_000;
      database
        .prepare(
          `INSERT INTO sessions (sid, sess, expired_at) VALUES (?, ?, ?)
        ON CONFLICT(sid) DO UPDATE SET sess = excluded.sess, expired_at = excluded.expired_at`,
        )
        .run(sid, JSON.stringify(value), expires);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  destroy(sid, callback = () => {}) {
    try {
      database.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }
}
