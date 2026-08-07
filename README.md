# Maloba® — Portafolio creativo

Sitio de portafolio construido con React, TypeScript, Vite, React Router, Framer Motion y React Helmet Async. Todo el contenido y los recursos visuales son provisionales y están preparados para sustituirse.

## Desarrollo

```bash
npm install
npm run dev
```

Vite mostrará la dirección local. Para validar la versión final:

```bash
npm run lint
npm run build
npm run preview
```

## Personalización

- **Colores, tipografías y espaciado:** edita `src/styles/tokens.css`.
- **Estilos globales y responsive:** edita `src/styles/global.css`.
- **Proyectos:** crea y actualiza contenido desde `/admin-maloba`. `src/data/projects.ts` funciona únicamente como respaldo si la API local no está disponible.
- **Imágenes:** las portadas subidas desde el gestor se almacenan en `uploads/`. `Artwork.tsx` mantiene las composiciones gráficas para proyectos sin fotografía.
- **Contacto:** edita correo y redes en `src/pages/HomePage.tsx`. El formulario es una demo frontend y no envía datos a un servidor.
- **Textos:** el contenido de inicio vive en `HomePage.tsx`; cada caso se controla desde `projects.ts`.

## Administración privada y base de datos

El gestor no aparece en la navegación pública. Abre directamente `/admin-maloba` e inicia sesión para crear, actualizar o retirar proyectos. Los datos se guardan en `data/maloba.db` y las portadas en `uploads/`; ambos directorios deben conservarse en copias de seguridad y en cualquier despliegue.

Las credenciales y la clave de sesión se leen desde `.env`. El archivo local ya contiene credenciales iniciales y está excluido de Git. Para cambiar la contraseña:

```bash
npm run password -- "una-contraseña-nueva-y-segura"
```

Copia el hash resultante en `ADMIN_PASSWORD_HASH` dentro de `.env`. Cambia también `ADMIN_USERNAME` y `SESSION_SECRET` antes de desplegar. Nunca publiques ni subas `.env` al repositorio.

En producción con HTTPS configura `COOKIE_SECURE=true`. Para desarrollo local debe permanecer en `false`.

## Ejecución y despliegue

En desarrollo, `npm run dev` inicia el frontend y la API juntos. Para producción:

```bash
npm run build
npm start
```

El servidor Node entrega la aplicación, la API y las imágenes. El hosting debe soportar un proceso Node persistente y conservar `data/` y `uploads/` entre despliegues; un hosting exclusivamente estático ya no es suficiente. Configura HTTPS, `NODE_ENV=production`, `COOKIE_SECURE=true` y las variables secretas antes de exponerlo en internet.

El proyecto incluye `railway.json`, un health check y soporte para `STORAGE_ROOT`. La guía completa para Railway y GoDaddy está en [`DEPLOYMENT.md`](./DEPLOYMENT.md).
