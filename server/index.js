import 'dotenv/config';
import bcrypt from 'bcryptjs';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import multer from 'multer';
import session from 'express-session';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  database,
  databasePath,
  rowToProject,
  SQLiteSessionStore,
  storageRoot,
} from './database.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uploadsDirectory = path.join(storageRoot, 'uploads');
fs.mkdirSync(uploadsDirectory, { recursive: true });

const app = express();
const port = Number(process.env.PORT || 4000);
const production = process.env.NODE_ENV === 'production';
const secureCookies = process.env.COOKIE_SECURE === 'true';
const sessionSecret = process.env.SESSION_SECRET;
const adminUsername = process.env.ADMIN_USERNAME;
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

if (!sessionSecret || !adminUsername || !adminPasswordHash) {
  throw new Error('Faltan SESSION_SECRET, ADMIN_USERNAME o ADMIN_PASSWORD_HASH en .env');
}

if (production) app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-origin' } }));
app.use(express.json({ limit: '1mb' }));
app.use(
  session({
    name: 'maloba.admin',
    secret: sessionSecret,
    store: new SQLiteSessionStore(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure: secureCookies,
      maxAge: 8 * 60 * 60 * 1000,
    },
  }),
);
app.use('/uploads', express.static(uploadsDirectory, { immutable: true, maxAge: '1y' }));

app.get('/api/health', (_request, response) => {
  database.prepare('SELECT 1').get();
  response.status(200).json({ status: 'ok' });
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
});
const requireAdmin = (request, response, next) => {
  if (request.session?.isAdmin === true) return next();
  return response.status(401).json({ error: 'No autorizado' });
};
const requireAdminHeader = (request, response, next) => {
  if (request.get('x-maloba-admin') !== '1')
    return response.status(403).json({ error: 'Solicitud rechazada' });
  return next();
};

app.get('/api/projects', (_request, response) => {
  const rows = database.prepare('SELECT * FROM projects ORDER BY created_at DESC, rowid ASC').all();
  response.json(rows.map(rowToProject));
});

app.get('/api/admin/session', (request, response) => {
  response.json({ authenticated: request.session?.isAdmin === true });
});

app.post('/api/admin/login', loginLimiter, async (request, response) => {
  const username = String(request.body?.username || '');
  const password = String(request.body?.password || '');
  const usernameMatches = crypto.timingSafeEqual(
    Buffer.from(username.padEnd(128).slice(0, 128)),
    Buffer.from(adminUsername.padEnd(128).slice(0, 128)),
  );
  const passwordMatches = await bcrypt.compare(password, adminPasswordHash);
  if (!usernameMatches || !passwordMatches)
    return response.status(401).json({ error: 'Credenciales incorrectas' });
  request.session.regenerate((error) => {
    if (error) return response.status(500).json({ error: 'No se pudo iniciar la sesión' });
    request.session.isAdmin = true;
    response.json({ authenticated: true });
  });
});

app.post('/api/admin/logout', requireAdmin, requireAdminHeader, (request, response) => {
  request.session.destroy(() => response.status(204).end());
});

const allowedArtwork = new Set(['orbit', 'type', 'grid', 'wave', 'stamp', 'arch']);
function normalizeProject(body) {
  const fields = [
    'slug',
    'name',
    'client',
    'year',
    'category',
    'description',
    'accent',
    'secondary',
    'artwork',
    'context',
    'problem',
    'concept',
    'solution',
  ];
  const project = Object.fromEntries(
    fields.map((field) => [field, String(body?.[field] || '').trim()]),
  );
  if (
    fields.some((field) => !project[field]) ||
    !Array.isArray(body?.services) ||
    !body.services.length
  )
    return null;
  if (!/^[a-z0-9-]{1,100}$/.test(project.slug) || !allowedArtwork.has(project.artwork)) return null;
  if (!/^#[0-9a-f]{6}$/i.test(project.accent) || !/^#[0-9a-f]{6}$/i.test(project.secondary))
    return null;
  return {
    ...project,
    services: body.services.map((item) => String(item).trim()).filter(Boolean),
    coverImage: body.coverImage ? String(body.coverImage) : null,
    galleryImages: Array.isArray(body.galleryImages)
      ? body.galleryImages
          .map((item) => String(item))
          .filter((item) => item.startsWith('/uploads/'))
      : [],
  };
}

app.put('/api/admin/projects/:slug', requireAdmin, requireAdminHeader, (request, response) => {
  const project = normalizeProject({ ...request.body, slug: request.params.slug });
  if (!project)
    return response.status(400).json({ error: 'Datos de proyecto incompletos o inválidos' });
  database
    .prepare(
      `INSERT INTO projects (
    slug, name, client, year, category, description, services, accent, secondary, artwork,
    context, problem, concept, solution, cover_image, gallery_images
  ) VALUES (
    @slug, @name, @client, @year, @category, @description, @services, @accent, @secondary,
    @artwork, @context, @problem, @concept, @solution, @coverImage, @galleryImages
  ) ON CONFLICT(slug) DO UPDATE SET
    name=excluded.name, client=excluded.client, year=excluded.year, category=excluded.category,
    description=excluded.description, services=excluded.services, accent=excluded.accent,
    secondary=excluded.secondary, artwork=excluded.artwork, context=excluded.context,
    problem=excluded.problem, concept=excluded.concept, solution=excluded.solution,
    cover_image=excluded.cover_image, gallery_images=excluded.gallery_images,
    updated_at=CURRENT_TIMESTAMP`,
    )
    .run({
      ...project,
      services: JSON.stringify(project.services),
      galleryImages: JSON.stringify(project.galleryImages),
    });
  response.json(project);
});

app.delete('/api/admin/projects/:slug', requireAdmin, requireAdminHeader, (request, response) => {
  const result = database.prepare('DELETE FROM projects WHERE slug = ?').run(request.params.slug);
  if (!result.changes) return response.status(404).json({ error: 'Proyecto no encontrado' });
  response.status(204).end();
});

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDirectory,
    filename: (_request, file, callback) =>
      callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 5_000_000 },
  fileFilter: (_request, file, callback) =>
    callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
});
app.post(
  '/api/admin/upload',
  requireAdmin,
  requireAdminHeader,
  upload.single('image'),
  (request, response) => {
    if (!request.file) return response.status(400).json({ error: 'Imagen inválida' });
    response.status(201).json({ url: `/uploads/${request.file.filename}` });
  },
);

if (production) {
  app.use(express.static(path.join(root, 'dist')));
  app.get('/{*splat}', (_request, response) =>
    response.sendFile(path.join(root, 'dist', 'index.html')),
  );
}

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError)
    return response.status(400).json({ error: 'La imagen supera el límite de 5 MB' });
  console.error(error);
  response.status(500).json({ error: 'Error interno del servidor' });
});

const server = app.listen(port, '0.0.0.0', () =>
  console.log(`maloba API lista en http://0.0.0.0:${port}\nBase persistente: ${databasePath}`),
);

function shutdown(signal) {
  console.log(`${signal}: cerrando el servidor de forma segura`);
  server.close(() => {
    database.close();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
