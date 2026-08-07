# maloba® — Portafolio creativo

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

- **Colores, tipografías y espaciado:** edita `src/styles/abstracts/_tokens.scss`.
- **Estilos:** `src/styles/main.scss` ensambla la base y los componentes compartidos. Cada página mantiene sus estilos exclusivos dentro de su propio directorio `styles/`; por ejemplo, el home usa `src/pages/home-page/styles/`. Los valores reutilizables y mixins viven en `src/styles/abstracts/_variables.scss`. Los módulos emplean nesting de Sass para mantener juntos los elementos, modificadores y estados de cada bloque. Vite compila todo a CSS optimizado durante el build.
- **Proyectos:** crea y actualiza contenido desde `/admin-maloba`. `src/data/projects.ts` funciona únicamente como respaldo si la API local no está disponible.
- **Archivo de proyectos:** `/es/projects` y `/en/projects` agrupan todos los casos por año y muestran 10 registros por carga. El home utiliza únicamente los 10 proyectos más recientes devueltos por la base de datos.
- **Imágenes:** las portadas y galerías subidas desde el gestor se almacenan en `uploads/`. La portada funciona como imagen principal y cada proyecto admite una cantidad abierta de imágenes de galería, limitada únicamente por el espacio disponible. La galería se puede reordenar arrastrando miniaturas o usando sus flechas; el orden se guarda junto con el proyecto. `Artwork.tsx` mantiene las composiciones gráficas para proyectos sin fotografía.
- **Orden del home:** cada proyecto nuevo entra automáticamente en la primera posición. Desde `/admin-maloba` puedes moverlo con las flechas; únicamente los primeros 10 se muestran en la portada.
- **Contacto:** edita WhatsApp y redes en `src/pages/home-page/sections/contact-section.tsx`. El formulario valida el nombre y el mensaje antes de abrir WhatsApp; no envía información automáticamente ni utiliza el servidor.
- **Textos e idiomas:** las traducciones viven en archivos JSON separados por sección dentro de `src/i18n/locales/es/` y `src/i18n/locales/en/`. `react-i18next` usa español como fallback. La función `m` de `src/i18n/messages.ts` detecta el idioma directamente desde la URL, por lo que no se pasan idiomas entre componentes. Se usa como `m(projects, 'kicker')`, importando también la biblioteca de la sección. El sitio usa `/es` y `/en`, y `/` redirige a español. Desde el admin puedes capturar categoría, descripción, servicios, contexto, problema, concepto y solución en inglés para cada proyecto; los campos ingleses vacíos usan el contenido español como respaldo.

## Organización del frontend

Cada ruta vive en su propia carpeta dentro de `src/pages/` y se exporta mediante un `index.ts`. Todos los archivos del frontend usan `kebab-case`. Sus bloques exclusivos se guardan en `sections/`, mientras que sus hooks y utilidades privadas viven bajo `hooks/` y `utils/` dentro de la página. Los componentes reutilizables permanecen en `src/components/`; los controles de formulario compartidos están agrupados en `src/components/forms/`.

Las páginas se consumen como librerías mediante los aliases `@home-page`, `@admin-page`, `@project-page`, `@projects-archive-page` y `@not-found-page`. También existen aliases compartidos como `@components`, `@hooks`, `@i18n`, `@data` y `@app-types`. Están configurados conjuntamente en `tsconfig.app.json` y `vite.config.ts`; no se necesita Webpack para desarrollo ni para Railway.

## Administración privada y base de datos

El gestor no aparece en la navegación pública. Abre directamente `/admin-maloba` e inicia sesión para crear, actualizar o retirar proyectos. Los datos se guardan en `data/maloba.db` y las portadas en `uploads/`; ambos directorios deben conservarse en copias de seguridad y en cualquier despliegue.

Los seis proyectos iniciales se insertan una sola vez, únicamente al crear una base vacía. El estado de esa migración se registra en `app_meta`; reiniciar el servidor ya no vuelve a insertar proyectos eliminados. Al arrancar, el servidor imprime la ruta exacta de la base que está utilizando.

Las credenciales y la clave de sesión se leen desde `.env`. El archivo local ya contiene credenciales iniciales y está excluido de Git. Para cambiar la contraseña:

```bash
npm run password -- "una-contraseña-nueva-y-segura"
```

El comando reemplaza automáticamente `ADMIN_PASSWORD_HASH` dentro de `.env`. Reinicia el servidor para aplicar el cambio. Cambia también `ADMIN_USERNAME` y `SESSION_SECRET` antes de desplegar. Nunca publiques ni subas `.env` al repositorio.

En producción con HTTPS configura `COOKIE_SECURE=true`. Para desarrollo local debe permanecer en `false`.

## Ejecución y despliegue

En desarrollo, `npm run dev` inicia el frontend y la API juntos. Para producción:

```bash
npm run build
npm start
```

El servidor Node entrega la aplicación, la API y las imágenes. El hosting debe soportar un proceso Node persistente y conservar `data/` y `uploads/` entre despliegues; un hosting exclusivamente estático ya no es suficiente. Configura HTTPS, `NODE_ENV=production`, `COOKIE_SECURE=true` y las variables secretas antes de exponerlo en internet.

En Railway, `STORAGE_ROOT` debe ser `/app/storage` y el volumen debe estar montado en esa misma ruta. Si falta cualquiera de esas dos configuraciones, el deployment utilizará almacenamiento efímero y parecerá crear una base nueva.

El proyecto incluye `railway.json`, un health check y soporte para `STORAGE_ROOT`. La guía completa para Railway y GoDaddy está en [`DEPLOYMENT.md`](./DEPLOYMENT.md).
